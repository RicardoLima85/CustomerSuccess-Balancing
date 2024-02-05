const MIN_CUSTOMER_SUCCESS = 0;
const MIN_CUSTOMER = 0;
const MAX_CUSTOMER_SUCCESS = 1000;
const MAX_CUSTOMER = 1000000;
const MAX_CUSTOMER_SUCCESS_SCORE = 10000;
const MAX_CUSTOMER_SCORE = 100000;

function sortByScoreAsc(itemA, itemB) {
  return itemA.score - itemB.score;
}

function sortByServedDesc(customerSuccessA, customerSuccessB) {
  return customerSuccessB.served - customerSuccessA.served;
}

function validateCustomerSuccess(customerSuccess, customerSuccessAway) {
  const maxAway = Math.floor(customerSuccess.length / 2);

  if (maxAway < customerSuccessAway.length) throw new Error("Max away exceed");

  const customerSuccessReady = customerSuccess.filter(
    (customerSuccess) => !customerSuccessAway.includes(customerSuccess.id)
  );

  if (MIN_CUSTOMER_SUCCESS >= customerSuccessReady.length)
    throw new Error("Min customerSuccess");

  if (MAX_CUSTOMER_SUCCESS <= customerSuccessReady.length)
    throw new Error("Max customerSuccess exceed");

  const customerSuccessInvalid = customerSuccessReady.filter(
    (customerSuccess) =>
      customerSuccess.id === MIN_CUSTOMER_SUCCESS ||
      customerSuccess.id >= MAX_CUSTOMER_SUCCESS ||
      customerSuccess.score === MIN_CUSTOMER_SUCCESS ||
      customerSuccess.score >= MAX_CUSTOMER_SUCCESS_SCORE
  );

  if (customerSuccessInvalid.length > 0)
    throw new Error("Invalid customerSuccess");

  return customerSuccessReady;
}

function validateCustomer(customers) {
  if (MIN_CUSTOMER >= customers.length) throw new Error("Min customers");

  if (MAX_CUSTOMER <= customers.length) throw new Error("Max customers exceed");

  const customersInvalid = customers.filter(
    (customer) =>
      customer.id === MIN_CUSTOMER ||
      customer.id >= MAX_CUSTOMER ||
      customer.score === MIN_CUSTOMER ||
      customer.score >= MAX_CUSTOMER_SCORE
  );

  if (customersInvalid.length > 0) throw new Error("Invalid customer");
}

/**
 * Returns the id of the CustomerSuccess with the most customers
 * @param {array} customerSuccess
 * @param {array} customers
 * @param {array} customerSuccessAway
 */

function customerSuccessBalancing(
  customerSuccess,
  customers,
  customerSuccessAway
) {

  const customerSuccessReady = validateCustomerSuccess(
    customerSuccess,
    customerSuccessAway
  );
  validateCustomer(customers);

  if (customerSuccessReady.length === 1) return customerSuccessReady[0].id;

  const customerSuccessBusy = customerSuccessReady
    .filter(
      (customerSuccess) => !customerSuccessAway.includes(customerSuccess.id)
    )
    .sort(sortByScoreAsc)
    .map((customerSuccess) => {
      let served = 0;
      for (let i = customers.length - 1; i >= 0; i--) {
        const customer = customers[i];
        if (customer.score <= customerSuccess.score) {
          customers.splice(i, 1);
          served++;
        }
      }
      return {
        ...customerSuccess,
        served,
      };
    })
    .sort(sortByServedDesc);

  return customerSuccessBusy[0].served === customerSuccessBusy[1].served
    ? 0
    : customerSuccessBusy[0].id;
}

function mapEntities(arr) {
  return arr.map((item, index) => ({
    id: index + 1,
    score: item,
  }));
}

function arraySeq(count, startAt) {
  return Array.apply(0, Array(count)).map((it, index) => index + startAt);
}

function arraySeqFixed(count, startAt) {
  return [...Array(count)].map((_, index) => index + startAt);
}

test("Scenario 9, it should throw a error when away get higher than max entries allowed", () => {
  const css = mapEntities([1, 2, 3, 4]);
  const customers = mapEntities([10, 20, 30]);
  const csAway = [1, 2, 3];
  expect(() => customerSuccessBalancing(css, customers, csAway)).toThrowError(
    "Max away exceed"
  );
});

test("Scenario 10, it should throw a error when customerSuccess has lower entries than minimal", () => {
  const css = [];
  const customers = mapEntities([10]);
  const csAway = [];
  expect(() => customerSuccessBalancing(css, customers, csAway)).toThrowError(
    "Min customerSuccess"
  );
});

test("Scenario 11, it should throw a error when have more entries than max customerSuccess", () => {
  const css = mapEntities(arraySeq(1001, 1));
  const customers = mapEntities([10]);
  const csAway = [1];
  expect(() => customerSuccessBalancing(css, customers, csAway)).toThrowError(
    "Max customerSuccess exceed"
  );
});

test("Scenario 12, it should throw a error when customers has lower entries than minimal", () => {
  const css = mapEntities([10, 20]);
  const customers = [];
  const csAway = [1];
  expect(() => customerSuccessBalancing(css, customers, csAway)).toThrowError(
    "Min customers"
  );
});

test("Scenario 13, it should throw a error when more entries than max customer", () => {
  const css = mapEntities([10, 20]);
  const customers = mapEntities(arraySeqFixed(1000001, 1));
  const csAway = [1];
  expect(() => customerSuccessBalancing(css, customers, csAway)).toThrowError(
    "Max customers exceed"
  );
});

test("Scenario 14, it should throw a error when have customerSuccess with id higher than max", () => {
  const css = [{ id: 1000, score: 10 }];
  const customers = mapEntities(arraySeqFixed(2, 1));
  const csAway = [];
  expect(() => customerSuccessBalancing(css, customers, csAway)).toThrowError(
    "Invalid customerSuccess"
  );
});

test("Scenario 15, it should throw a error when have customerSuccess with score higher than max", () => {
  const css = [{ id: 1, score: 10000 }];
  const customers = mapEntities(arraySeqFixed(2, 1));
  const csAway = [];
  expect(() => customerSuccessBalancing(css, customers, csAway)).toThrowError(
    "Invalid customerSuccess"
  );
});

test("Scenario 16, it should throw a error when have customers with id higher than max", () => {
  const css = [{ id: 1, score: 100 }];
  const customers = [{ id: 1000000, score: 80 }];
  const csAway = [];
  expect(() => customerSuccessBalancing(css, customers, csAway)).toThrowError(
    "Invalid customer"
  );
});

test("Scenario 17, it should throw a error when have customers with id higher than max", () => {
  const css = [{ id: 1, score: 100 }];
  const customers = [{ id: 1, score: 100000 }];
  const csAway = [];
  expect(() => customerSuccessBalancing(css, customers, csAway)).toThrowError(
    "Invalid customer"
  );
});
