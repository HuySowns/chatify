import { Notification } from "../models/notification.model.js";

export const getNotifications = async (req, res, next) => {
    try {
        const userId = req.auth?.userId || req.body.userId;
        const notifications = await Notification.find({ userId });
        res.json(notifications);
    } catch (error) {
        next(error);
    }
};

export const createNotification = async (req, res, next) => {
    try {
        const { message, type, relatedId } = req.body;
        const userId = req.auth?.userId || req.body.userId; 
        const notification = await Notification.create({ userId, message, type, relatedId });
        res.status(201).json(notification);
    } catch (error) {
        next(error);
    }
};

export const deleteNotification = async (req, res, next) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Notification deleted" });
    } catch (error) {
        next(error);
    }
};
