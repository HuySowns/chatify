import { Transaction } from "../models/transaction.model.js";

export const getTransactions = async (req, res, next) => {
    try {
        const transactions = await Transaction.find();
        res.json(transactions);
    } catch (error) {
        next(error);
    }
};

export const createTransaction = async (req, res, next) => {
    try {
        const { amount, description } = req.body;
        const userId = req.auth?.userId || req.body.userId; 
        const transaction = await Transaction.create({ amount, description, userId });
        res.status(201).json(transaction);
    } catch (error) {
        next(error);
    }
};

export const deleteTransaction = async (req, res, next) => {
    try {
        await Transaction.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Transaction deleted" });
    } catch (error) {
        next(error);
    }
};
