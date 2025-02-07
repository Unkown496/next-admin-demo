/**
 * Исключает указанные ключи из объекта
 * @param {Object} obj - Исходный объект
 * @param {string[]} keys - Ключи для исключения
 * @returns {Object} Новый объект без указанных ключей
 */
export function excludeKeys(obj, keys) {
  const excludedObject = {
    ...obj,
  };

  keys.forEach(key => {
    Reflect.deleteProperty(excludedObject, key);
  });

  return excludedObject;
}

/** @type {(target: object) => boolean} */
export const isEmptyObject = target => Object.keys(target).length === 0;

/**
 * @template T
 * @param {FormData} formData
 * @returns {T}
 */
export function FormDataToObject(formData) {
  const dataObject = {};

  formData.forEach((value, key) => {
    if (dataObject[key]) {
      dataObject[key] = Array.isArray(dataObject[key])
        ? [...dataObject[key], value]
        : [dataObject[key], value];
    } else {
      dataObject[key] = value;
    }
  });

  return dataObject;
}
