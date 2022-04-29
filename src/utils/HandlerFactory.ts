import express, { Request, Response, NextFunction } from "express";
import CatchAsync from "../utils/CatchAsync";
import { ErrorHandling } from "./ErrorHandling";
import { APIFeatures } from "./APIFeatures";

/*exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No doc found by that id', 404));
    }
    res.status(204).json({
      status: 'success',
      message: 'Successfully deleted tour!',
    });
  });*/

export const deleteOne = (Model: any) =>
  CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new ErrorHandling("No doc found by that id", 404));
    }
    res.status(204).json({
      status: "success",
      message: "Successfully deleted tour!",
    });
  });

/*exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('No doc found by that id', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });*/

export const updateOne = (Model: any) =>
  CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new ErrorHandling("No doc found by that id", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
       doc,
      },
    });
  });

/*exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });*/

export const createOne = (Model: any) =>
  CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

/*exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
      return next(new AppError('No doc found with that id', 404));
    }

    res.status(200).json({
      status: 'He man you succeed!!',
      data: {
        doc,
      },
    });
  });*/

export const getOne = (Model: any, popOptions?: any) =>
  CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
      return next(new ErrorHandling("No doc found with that id", 404));
    }

    res.status(200).json({
      /*status: "He man you succeed!!",
      data: {*/
      ...doc,
      //},
    });
  });

/*exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter;
    if (req.params.tour) filter = { tour: req.params.tour };
    // EXECUTE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });*/

export const getAll = (Model: any, popOptions?: any) =>
  CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let filter;
    if (req.params.products) filter = { products: req.params.products };
    // EXECUTE QUERY
    const features: any = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      ...doc,
      /*status: 'success',
      results: doc.length,
      data: {
        data: doc

      },*/
    });
  });
