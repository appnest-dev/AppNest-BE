import { Transaction } from "sequelize";
import sequelize from "../config/db";

const useTransaction = async () => {
  let transaction: Transaction;

  beforeEach(async () => {
    transaction = await sequelize.transaction();
  });

  afterEach(async () => {
    await transaction.rollback();
  });
};

export default useTransaction;
