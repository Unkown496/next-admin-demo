'use server';

import argon2 from 'argon2';

import orm from '@prisma/orm';

import { FormDataToObject } from '@helpers/object';

import Type from '@lib/validation';
import { TypeCompiler } from '@sinclair/typebox/compiler';

const model = {
  update: TypeCompiler.Compile(
    Type.Object(
      {
        password: Type.String(),
        email: Type.String({
          format: 'email',
        }),
      },
      {
        additionalProperties: true,
      },
    ),
  ),
};

/** @type {() => Promise<Array<{ id: number }>>} */
export async function get() {
  const adminsIds = await orm.admin.findMany({
    select: {
      id: true,
    },
  });

  return adminsIds;
}

/** @type {(formData: FormData) => Promise<void>} */
export async function updateForm(formData) {
  try {
    const adminData = FormDataToObject(formData);

    const isValid = model.update.Check(adminData);

    if (!isValid)
      return {
        error: JSON.stringify(
          [...model.update.Errors(adminData)].map(err => err.message).join(' '),
        ),
      };

    const findUpdatableAdmin = await orm.admin.findUnique({
      where: {
        id: +adminData.id,
      },
    });

    if (!findUpdatableAdmin)
      return {
        error: 'Admin by id not found!',
      };

    if (findUpdatableAdmin.email === adminData.email) {
      return {
        error: 'Admin and so it has this email!',
      };
    }

    const updatedAdmin = await orm.admin.update({
      where: {
        id: findUpdatableAdmin.id,
      },
      data: {
        email: adminData.email,
        password: await argon2.hash(adminData.password),
      },
    });

    return {
      success: true,
    };
  } catch (err) {
    console.log(err);
  }
}
