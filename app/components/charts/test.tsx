type KeysOfType<T, TypeToExtract> = {
  [K in keyof T]: T[K] extends TypeToExtract ? K : never;
}[keyof T];

interface Product {
  name: string;
  price: number;
}

// Наша функция теперь выглядит так:
function getNumericValue<T extends Product, K extends KeysOfType<T, number>>(
  obj: T & Record<K, number>,
  key: K
): number {
  // Раньше тут была ошибка компиляции.
  // Теперь TS видит Record<K, number> и железно знает: по ключу K лежит number!
  const value = obj[key];

  return value;
}

interface SmartPhone extends Product {
  brand: string;
  megapixels: number; // Новое числовое поле у наследника
}

const iPhone: SmartPhone = {
  name: 'iPhone 15',
  price: 999,
  brand: 'Apple',
  megapixels: 48
};

// 1. Работает динамический ключ из наследника:
const dynamicField: KeysOfType<SmartPhone, number> = 'megapixels';

// TS выведет тип 'number' для переменной megapixelsValue!
const megapixelsValue = getNumericValue(iPhone, dynamicField);

// 2. Автокомплит работает идеально:
// Если ты начнешь писать второй аргумент, TS предложит только: "price" | "megapixels"
getNumericValue(iPhone, 'price'); // OK

// 3. Защита от ошибок по-прежнему на высоте:
// @ts-expect-error — brand не число, TS выдаст ошибку компиляции!
getNumericValue(iPhone, 'brand');
