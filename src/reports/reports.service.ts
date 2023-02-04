import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Floor, FloorDocument } from 'src/floor/schema/floor.schema';
import { ParckingCategory, ParckingCategoryDocument } from 'src/parcking-category/schema/parcking-category.schema';
import { ParckingPlace, ParckingPlaceDocument } from 'src/parcking-place/schema/parcking-place.schema';
import { Parcking, ParckingDocument } from 'src/parcking/schema/parcking.schema';
import { Slot, SlotDocument } from 'src/slot/schema/slot.schema';
import { SummaryReportDto } from './dto/summary-reports.dto';
import { ReportDocument, Reports } from './schema/reports.schema';
import { SLOT_STATUS } from 'src/constants/slot.constant';

@Injectable()
export class ReportsService {
    constructor(
        @InjectModel(Parcking.name) private parckingModel: Model<ParckingDocument>,
        @InjectModel(Slot.name) private slotgModel: Model<SlotDocument>,
        @InjectModel(ParckingPlace.name) private parckingPlaceModel: Model<ParckingPlaceDocument>,
        @InjectModel(ParckingCategory.name) private ParckingCategoryModel: Model<ParckingCategoryDocument>,
        @InjectModel(Floor.name) private floorModel: Model<FloorDocument>,
        @InjectModel(Reports.name) private reportModel: Model<ReportDocument>,
    ){}

    async getReport(inputQuery: SummaryReportDto){
        const floorName = await this.floorModel.findById(inputQuery.floor)
        const slotReport = await this.parckingPlaceModel.aggregate([
            {
                $lookup: {
                  from: "floors",
                  localField: "_id",
                  foreignField: "place",
                  as: "floors"
                }
              },
              {
                $unwind: "$floors"
              },
              {
                $lookup: {
                  from: "slots",
                  localField: "floors._id",
                  foreignField: "floor",
                  as: "slots"
                }
              },
              {
                $unwind: "$slots"
              },
              {
                $lookup: {
                  from: "parkingcategories",
                  localField: "slots.category",
                  foreignField: "_id",
                  as: "category"
                }
              },
              {
                $group: {
                  _id: { place: "$name", floor: "$floors.name", category: "$category.type" },
                  totalSlots: { $sum: 1 },
                  bookedSlots: {
                    $sum: {
                      $cond: [
                        { $eq: ["$slots.status", "INACTIVE"] },
                        1,
                        0
                      ]
                    }
                  },
                  availableSlots: {
                    $sum: {
                      $cond: [
                        { $eq: ["$slots.status", "ACTIVE"] },
                        1,
                        0
                      ]
                    }
                  },
                  availableSlotName: {
                    $push: {
                      $cond: [
                        { $eq: ["$slots.status", "ACTIVE"] },
                        "$slots.name",
                        null
                      ]
                    }
                  }
                }
              },
              {
                $project: {
                  _id: 0,
                  place: "$_id.place",
                  floor: "$_id.floor",
                  category: "$_id.category",
                  totalSlots: 1,
                  bookedSlots: 1,
                  availableSlots: 1,
                  availableSlotName: {
                    $filter: {
                      input: "$availableSlotName",
                      as: "slotName",
                      cond: { $ne: ["$$slotName", null] }
                    }
                  }
                }
              }
        ])
        return slotReport
    }
}
