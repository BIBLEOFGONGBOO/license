import { createClient } from '@libsql/client/web';

// ============================================================================
// GONGBOO MEMBER CENTER
// Route: /api/member
// Tables: catalog, member
// ============================================================================

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'content-type, x-member-sync-secret, x-license-sync-secret',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json; charset=utf-8'
};

function json(body, status = 200) {
  return new Response(
    JSON.stringify(body),
    {
      status,
      headers: CORS_HEADERS
    }
  );
}

function text(value) {
  return String(value ?? '').trim();
}

function getValue(row, ...names) {
  for (const name of names) {
    if (
      Object.prototype.hasOwnProperty.call(row, name) &&
      row[name] !== undefined &&
      row[name] !== null
    ) {
      return row[name];
    }
  }

  return '';
}

function asRows(result) {
  return (result.rows || []).map(row => ({ ...row }));
}

function uniqueProductIds(value) {
  const raw = Array.isArray(value)
    ? value
    : String(value ?? '').split(',');

  return [
    ...new Set(
      raw
        .map(item => text(item))
        .filter(item => /^\d{4}$/.test(item))
    )
  ];
}

function getClient(env) {
  if (
    !env.TURSO_DATABASE_URL ||
    !env.TURSO_AUTH_TOKEN
  ) {
    throw new Error(
      'Turso environment variables are missing.'
    );
  }

  return createClient({
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN
  });
}

function requireSyncSecret(request, env) {
  const supplied =
    request.headers.get('x-member-sync-secret') ||
    request.headers.get('x-license-sync-secret') ||
    '';

  if (
    !env.MEMBER_SYNC_SECRET ||
    supplied !== env.MEMBER_SYNC_SECRET
  ) {
    throw new Error('Unauthorized.');
  }
}

function base64(bytes) {
  let result = '';

  for (const byte of bytes) {
    result += String.fromCharCode(byte);
  }

  return btoa(result);
}

async function hashPassword(password) {
  const cleanPassword = String(password ?? '');

  if (!/^\d{4,}$/.test(cleanPassword)) {
    throw new Error(
      'PIN must contain at least 4 digits.'
    );
  }

  const encoder = new TextEncoder();

  const salt = crypto.getRandomValues(
    new Uint8Array(16)
  );

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(cleanPassword),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const derived = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt,
      iterations: 100000
    },
    key,
    256
  );

  return [
    'pbkdf2',
    '100000',
    base64(salt),
    base64(new Uint8Array(derived))
  ].join('$');
}



function fromBase64(value) {
  const raw = atob(value);
  const bytes = new Uint8Array(raw.length);

  for (let index = 0; index < raw.length; index += 1) {
    bytes[index] = raw.charCodeAt(index);
  }

  return bytes;
}

function sameBytes(left, right) {
  if (left.length !== right.length) {
    return false;
  }

  let difference = 0;

  for (let index = 0; index < left.length; index += 1) {
    difference |= left[index] ^ right[index];
  }

  return difference === 0;
}



async function verifyPin(pin, storedHash) {
  const cleanPin = String(pin ?? '');

  if (!/^\d{4,}$/.test(cleanPin)) {
    return false;
  }

  const parts = String(storedHash || '').split('$');

  if (
    parts.length !== 4 ||
    parts[0] !== 'pbkdf2'
  ) {
    return false;
  }

  const iterations = Number(parts[1]);

  if (
    !Number.isInteger(iterations) ||
    iterations < 1 ||
    iterations > 100000
  ) {
    return false;
  }

  const salt = fromBase64(parts[2]);

  const expected = fromBase64(parts[3]);

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(cleanPin),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const actual = new Uint8Array(
    await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        hash: 'SHA-256',
        salt,
        iterations
      },
      key,
      expected.length * 8
    )
  );

  return sameBytes(actual, expected);
}



async function validateProductIds(client, productIds) {
  for (const productId of productIds) {
    const result = await client.execute({
      sql: `
        SELECT product_id
        FROM catalog
        WHERE product_id = ?
      `,
      args: [productId]
    });

    if (!result.rows.length) {
      throw new Error(
        `Unknown product_id: ${productId}`
      );
    }
  }
}

async function pullAll(client) {
  const catalogResult = await client.execute(`
    SELECT
      product_id,
      product,
      ready,
      note
    FROM catalog
    ORDER BY product_id
  `);

  const memberResult = await client.execute(`
    SELECT
      user_id,
      email,
      name,
      phone,
      product_id,
      start_date,
      expires_at,
      payment,
      status,
      note
    FROM member
    ORDER BY email, product_id
  `);

  return {
    catalog: asRows(catalogResult),
    member: asRows(memberResult)
  };
}

async function pushCatalog(client, rows) {
  let saved = 0;

  for (const row of rows) {
    const productId = text(
      getValue(row, 'product_id', 'PRODUCT_ID')
    );

    const product = text(
      getValue(row, 'product', 'PRODUCT')
    );

    if (!/^\d{4}$/.test(productId) || !product) {
      continue;
    }

    const ready =
      text(getValue(row, 'ready', 'READY'))
        .toUpperCase() === 'T'
        ? 'T'
        : 'F';

    const note = text(
      getValue(row, 'note', 'NOTE')
    );

    await client.execute({
      sql: `
        INSERT INTO catalog (
          product_id,
          product,
          ready,
          note
        )
        VALUES (?, ?, ?, ?)

        ON CONFLICT(product_id)
        DO UPDATE SET
          product = excluded.product,
          ready = excluded.ready,
          note = excluded.note
      `,
      args: [
        productId,
        product,
        ready,
        note
      ]
    });

    saved += 1;
  }

  return saved;
}

async function pushmember(client, rows) {
  let saved = 0;

  for (const row of rows) {
    const userId = text(
      getValue(row, 'user_id', 'USER_ID')
    );

    const productId = text(
      getValue(row, 'product_id', 'PRODUCT_ID')
    );

    if (!userId || !/^\d{4}$/.test(productId)) {
      continue;
    }

    await validateProductIds(client, [productId]);

 const existing = await client.execute({
  sql: `
    SELECT password_hash
    FROM member
    WHERE user_id = ?
    LIMIT 1
  `,
  args: [userId]
});

    const existingHash =
      existing.rows[0]?.password_hash || '';

    await client.execute({
      sql: `
        INSERT INTO member (
          user_id,
          email,
          name,
          phone,
          password_hash,
          product_id,
          start_date,
          expires_at,
          payment,
          status,
          note
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

        ON CONFLICT(user_id, product_id)
        DO UPDATE SET
          email = excluded.email,
          name = excluded.name,
          phone = excluded.phone,
          start_date = excluded.start_date,
          expires_at = excluded.expires_at,
          payment = excluded.payment,
          status = excluded.status,
          note = excluded.note
      `,
      args: [
        userId,
        text(getValue(row, 'email', 'EMAIL'))
          .toLowerCase(),
        text(getValue(row, 'name', 'NAME')),
        text(getValue(row, 'phone', 'PHONE')),
        existingHash,
        productId,
        text(
          getValue(row, 'start_date', 'START_DATE')
        ),
        text(
          getValue(row, 'expires_at', 'EXPIRES_AT')
        ),
        text(
          getValue(row, 'payment', 'PAYMENT')
        ) || 'UNPAID',
        text(
          getValue(row, 'status', 'STATUS')
        ).toUpperCase() || 'PENDING',
        text(getValue(row, 'note', 'NOTE'))
      ]
    });

    saved += 1;
  }

  return saved;
}

/* ============================================================================
   SUBBLOCK 6600 START : CREATE MEMBER
   ============================================================================ */

async function createMember(client, payload) {
  const email = text(payload.email).toLowerCase();

  const password = String(payload.password ?? '');

  const requestedProductIds = uniqueProductIds(
    payload.product_ids || payload.product_id
  );

  const productIds = requestedProductIds.length
    ? requestedProductIds
    : ['0000'];

  if (!email.includes('@')) {
    throw new Error('A valid email is required.');
  }

  if (!/^\d{4,}$/.test(password)) {
    throw new Error(
      'PIN must contain at least 4 digits.'
    );
  }

  if (productIds.includes('0000')) {
    await client.execute({
      sql: `
        INSERT OR IGNORE INTO catalog (
          product_id,
          product,
          ready,
          note
        )
        VALUES (?, ?, ?, ?)
      `,
      args: [
        '0000',
        'GONGBOO MEMBER ACCOUNT',
        'F',
        'System account row. No content access.'
      ]
    });
  }

  await validateProductIds(client, productIds);

  let userId = text(payload.user_id);

  if (!userId) {
    const existingResult = await client.execute({
      sql: `
        SELECT user_id
        FROM member
        WHERE lower(email) = lower(?)
        LIMIT 1
      `,
      args: [email]
    });

    userId =
      text(existingResult.rows[0]?.user_id) ||
      crypto.randomUUID();
  }

  const passwordHash = await hashPassword(password);

  for (const productId of productIds) {
    await client.execute({
      sql: `
        INSERT INTO member (
          user_id,
          email,
          name,
          phone,
          password_hash,
          product_id,
          start_date,
          expires_at,
          payment,
          status,
          note
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

        ON CONFLICT(user_id, product_id)
        DO UPDATE SET
          email = excluded.email,
          name = excluded.name,
          phone = excluded.phone,
          password_hash = excluded.password_hash,
          start_date = excluded.start_date,
          expires_at = excluded.expires_at,
          payment = excluded.payment,
          status = excluded.status,
          note = excluded.note
      `,
      args: [
        userId,
        email,
        text(payload.name),
        text(payload.phone),
        passwordHash,
        productId,
        text(payload.start_date),
        text(payload.expires_at),
        text(payload.payment) || 'UNPAID',
        text(payload.status).toUpperCase() ||
          'PENDING',
        text(payload.note)
      ]
    });
  }

  return {
    user_id: userId,
    email,
    product_ids: productIds
  };
}

/* ============================================================================
   SUBBLOCK 6600 END : CREATE MEMBER
   ============================================================================ */



/* ============================================================================
   BLOCK 6650 : start
   ============================================================================ */


async function resetPassword(client, payload) {
  const userId = text(payload.user_id);

  const password = String(payload.password ?? '');

  if (!userId) {
    throw new Error('user_id is required.');
  }

  if (!/^\d{4,}$/.test(password)) {
    throw new Error(
      'PIN must contain at least 4 digits.'
    );
  }

  const passwordHash = await hashPassword(password);

  const result = await client.execute({
    sql: `
      UPDATE member
      SET password_hash = ?
      WHERE user_id = ?
    `,
    args: [
      passwordHash,
      userId
    ]
  });

  if (!result.rowsAffected) {
    throw new Error('Member was not found.');
  }

  return {
    user_id: userId,
    updated_rows: result.rowsAffected
  };
}

async function deletemember(client, payload) {
  const userIds = Array.isArray(payload.user_ids)
    ? payload.user_ids.map(text).filter(Boolean)
    : [text(payload.user_id)].filter(Boolean);

  let deleted = 0;

  for (const userId of userIds) {
    const result = await client.execute({
      sql: `
        DELETE FROM member
        WHERE user_id = ?
      `,
      args: [userId]
    });

    deleted += Number(result.rowsAffected || 0);
  }

  return { deleted };
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS
  });
}

export async function onRequestGet() {
  return json({
    ok: true,
    service: 'gongboo-member-center'
  });
}


async function loginMember(client, payload) {
  const email = text(payload.email).toLowerCase();
  const pin = String(payload.pin ?? '');

  if (!email || !/^\d{4,}$/.test(pin)) {
    throw new Error('Invalid email or PIN.');
  }

  const memberResult = await client.execute({
    sql: `
      SELECT
        user_id,
        email,
        name,
        password_hash
      FROM member
      WHERE lower(email) = lower(?)
      LIMIT 1
    `,
    args: [email]
  });

  const member = memberResult.rows[0];

  if (
    !member ||
    !(await verifyPin(pin, member.password_hash))
  ) {
    throw new Error('Invalid email or PIN.');
  }

  const productsResult = await client.execute({
    sql: `
      SELECT product_id
      FROM member
      WHERE user_id = ?
        AND status = 'ACTIVE'
      ORDER BY product_id
    `,
    args: [member.user_id]
  });

  return {
    user_id: member.user_id,
    email: member.email,
    name: member.name || '',
    product_ids: productsResult.rows.map(
      row => row.product_id
    )
  };
}
/* ============================================================================
   BLOCK 6650 : end
   ============================================================================ */


/* ============================================================================
   BLOCK 6700 : ACTIVE PRODUCT LOOKUP
   ============================================================================ */

async function getActiveProducts(
  client,
  userId
) {
  const cleanUserId = text(userId);

  if (!cleanUserId) {
    throw new Error('user_id is required.');
  }

  const adminResult = await client.execute({
    sql: `
      SELECT 1
      FROM member
      WHERE user_id = ?
        AND product_id = '0000'
        AND status = 'ACTIVE'
      LIMIT 1
    `,
    args: [cleanUserId]
  });

  const isAdmin =
    adminResult.rows.length > 0;

  const result = await client.execute({
    sql: isAdmin
      ? `
        SELECT
          product_id,
          product
        FROM catalog
        WHERE product_id <> '0000'
        ORDER BY product_id
      `
      : `
        SELECT
          member.product_id,
          catalog.product
        FROM member
        LEFT JOIN catalog
          ON catalog.product_id =
             member.product_id
        WHERE member.user_id = ?
          AND member.status = 'ACTIVE'
        ORDER BY member.product_id
      `,

    args: isAdmin
      ? []
      : [cleanUserId]
  });

  return {
    user_id: cleanUserId,
    is_admin: isAdmin,

    products: result.rows.map(row => ({
      product_id: text(row.product_id),
      product: text(row.product)
    }))
  };
}




export async function onRequestPost(context) {
  try {
    const payload = await context.request.json();

    const action = text(payload.action);

    const client = getClient(context.env);

    // ------------------------------------------------------------------------
    // PUBLIC : SIGN UP
    // ------------------------------------------------------------------------
    if (action === 'signup') {
      const email = text(payload.email).toLowerCase();

      const name = text(payload.name);

      const phone = text(payload.phone);

      const pin = String(payload.pin ?? '');

      if (!email.includes('@')) {
        throw new Error(
          'A valid e-mail is required.'
        );
      }

      if (!name) {
        throw new Error('Name is required.');
      }

      if (!/^\d{4,}$/.test(pin)) {
        throw new Error(
          'PIN must contain at least 4 digits.'
        );
      }

      const existingResult = await client.execute({
        sql: `
          SELECT user_id
          FROM member
          WHERE lower(email) = lower(?)
          LIMIT 1
        `,
        args: [email]
      });

      if (existingResult.rows.length) {
        throw new Error(
          'This e-mail is already registered. Please log in.'
        );
      }

      await client.execute({
        sql: `
          INSERT OR IGNORE INTO catalog (
            product_id,
            product,
            ready,
            note
          )
          VALUES (?, ?, ?, ?)
        `,
        args: [
          '0000',
          'GONGBOO MEMBER ACCOUNT',
          'T',
          'Website account row. No content access.'
        ]
      });

      const userId = crypto.randomUUID();

      const passwordHash = await hashPassword(pin);

      await client.execute({
        sql: `
          INSERT INTO member (
            user_id,
            product_id,
            email,
            name,
            phone,
            password_hash,
            start_date,
            expires_at,
            payment,
            status,
            note
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          userId,
          '0000',
          email,
          name,
          phone,
          passwordHash,
          '',
          '',
          'UNPAID',
          'PENDING',
          'Website sign up'
        ]
      });

      return json({
        ok: true,
        member: {
          user_id: userId,
          email: email,
          name: name,
          product_ids: []
        }
      });
    }

    // ------------------------------------------------------------------------
    // PUBLIC : LOGIN
    // ------------------------------------------------------------------------
    if (action === 'login') {
      return json({
        ok: true,
        member: await loginMember(client, payload)
      });
    }


    // ------------------------------------------------------------------------
    // PUBLIC : ACTIVE PRODUCTS
    // ------------------------------------------------------------------------
    if (action === 'active_products') {
      return json({
        ok: true,
        ...(await getActiveProducts(
          client,
          payload.user_id
        ))
      });
    }



    // ------------------------------------------------------------------------
    // PUBLIC : CHANGE PIN
    // ------------------------------------------------------------------------
    if (action === 'change_pin') {
      const email = text(payload.email).toLowerCase();

      const oldPin = String(payload.old_pin ?? '');

      const newPin = String(payload.new_pin ?? '');

      if (
        !email ||
        !/^\d{4,}$/.test(oldPin) ||
        !/^\d{4,}$/.test(newPin)
      ) {
        throw new Error(
          'E-mail and two valid PIN values are required.'
        );
      }

      const memberResult = await client.execute({
        sql: `
          SELECT
            user_id,
            password_hash
          FROM member
          WHERE lower(email) = lower(?)
          LIMIT 1
        `,
        args: [email]
      });

      const member = memberResult.rows[0];

      if (
        !member ||
        !(await verifyPin(
          oldPin,
          member.password_hash
        ))
      ) {
        throw new Error(
          'Current PIN is not correct.'
        );
      }

      const passwordHash =
        await hashPassword(newPin);

      await client.execute({
        sql: `
          UPDATE member
          SET password_hash = ?
          WHERE user_id = ?
        `,
        args: [
          passwordHash,
          member.user_id
        ]
      });

      return json({
        ok: true,
        user_id: member.user_id
      });
    }

    // ------------------------------------------------------------------------
    // ADMIN : GOOGLE SHEET ONLY
    // ------------------------------------------------------------------------
    requireSyncSecret(
      context.request,
      context.env
    );

    if (action === 'pull') {
      return json({
        ok: true,
        ...(await pullAll(client))
      });
    }

    if (action === 'push_catalog') {
      return json({
        ok: true,
        saved: await pushCatalog(
          client,
          payload.rows
        )
      });
    }

    if (action === 'push_member') {
      return json({
        ok: true,
        saved: await pushmember(
          client,
          payload.rows
        )
      });
    }

    if (action === 'create_member') {
      return json({
        ok: true,
        member: await createMember(client, payload)
      });
    }

    if (action === 'reset_password') {
      return json({
        ok: true,
        member: await resetPassword(client, payload)
      });
    }

    if (action === 'delete_member') {
      return json({
        ok: true,
        deleted: await deletemember(client, payload)
      });
    }

        return json(
      { error: 'Unknown action.' },
      400
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Server error.';

    return json(
      { error: message },
      400
    );
  }
}
