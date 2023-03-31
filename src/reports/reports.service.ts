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
import dayjs from "dayjs"
import { DetailsReportsDto } from './dto/details-reports.dto';

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
      let match = {}
      if (inputQuery.floor) {
        const floorName = await this.floorModel.findById(inputQuery.floor)
        match = { "floors": floorName }
      }
      if (inputQuery.place) {
        const placeName = await this.parckingPlaceModel.findById(inputQuery.place)
        match = {...match, "name": placeName.name }
      }
    
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
          $match: match
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
            },
          }
        },
        {
          $project: {
            _id: 0,
            place: "$_id.place",
            floor: "$_id.floor",
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
      ]);
      return slotReport;
    }

    async getSummaryReport(input: SummaryReportDto){
    const dateMatch = {};
    let match = {}
    if (input.floor) {
      const floorName = await this.floorModel.findById(input.floor)
      match = { "floorDetails": floorName }
    }
    if (input.place) {
      const placeName = await this.parckingPlaceModel.findById(input.place)
      match = {...match, "place": placeName }
    }
   if (input.type) {
      const type = await this.ParckingCategoryModel.findById(input.type);
     if (!type) throw new NotFoundException('Category Name Not Found');
      match = {...match, "type": type}
    }

    if (input.from_Date && input.to_Date) {
      dateMatch['in_time'] = {
        $gte: dayjs(input.from_Date).format("YYYY-MM-DD HH:mm:ss"),
        $lte: dayjs(input.to_Date).format("YYYY-MM-DD HH:mm:ss"),
      };
    }
      const summaryReport = await this.parckingModel.aggregate([
        {
          $match: dateMatch
        },
        {
          $lookup: {
              from: "slots",
              localField: "slot",
              foreignField: "_id",
              as: "slotDetails"
          }
      },
      {
        $lookup: {
          from: "floors",
          localField: "slotDetails.floor",
          foreignField: "_id",
          as: "floorDetails"
        }
      },
      {
        $lookup: {
            from: "parckingplaces",
            localField: "place",
            foreignField: "_id",
            as: "place"
        }
      },
      {
        $lookup: {
            from: "parckingcategories",
            localField: "type",
            foreignField: "_id",
            as: "type"
        }
      },
      {
        $match: match
      },
        {
          $group: {
              _id: {
                  place: "$place.name",
                  floor: "$floorDetails.name",
                  type: "$type.type"
              },
              totalParked: { $sum: 1 },
              totalAmount: { $sum: "$payable_amount" }
          }
      },
      {
          $group: {
              _id: {
                  place: "$_id.place",
                  floor: "$_id.floor"
              },
              totalParked: { $sum: "$totalParked" },
              category: {
                  $push: {
                      type: "$_id.type",
                      count: "$totalParked",
                      totalAmount: "$totalAmount"
                  }
              },
              totalAmount: { $sum: "$totalAmount" }
          }
      },
      {
          $project: {
              _id: 0,
              place: "$_id.place",
              floor: "$_id.floor",
              totalParked: "$totalParked",
              category: "$category",
              totalAmount: "$totalAmount",
          }
      }
      ])
      return summaryReport
    }

    async detailsReport(input: DetailsReportsDto){
      let dateMatch = {}
      let match = {}
      if(input.driver_Name){
        match = { "driver_Name": input.driver_Name }
      }
      if(input.driver_Mobile){
        match = { "driver_Mobile": input.driver_Mobile }
      }
      if(input.vehicle_Number){
        match= {...match, "vehicle_Number": input.vehicle_Number }
      }
      if (input.floor) {
        const floorName = await this.floorModel.findById(input.floor)
        match = {...match, "floorDetails": floorName }
      }
      if (input.place) {
        const placeName = await this.parckingPlaceModel.findById(input.place)
        match = {...match, "place": placeName }
      }
     if (input.type) {
        const type = await this.ParckingCategoryModel.findById(input.type);
       if (!type) throw new NotFoundException('Category Name Not Found');
        match = {...match, "type": type}
      }
      if (input.from_Date && input.to_Date) {
        dateMatch['out_time'] = {
          $gte: dayjs(input.from_Date).format("YYYY-MM-DD HH:mm:ss"),
          $lte: dayjs(input.to_Date).format("YYYY-MM-DD HH:mm:ss"),
        };
      }
      const detailsReport = await this.parckingModel.aggregate([
        {
          $match: dateMatch
        },
        {
          $lookup: {
            from: "slots",
            localField: "slot",
            foreignField: "_id",
            as: 'slot'
          }
        },
        {
          $lookup: {
            from: 'floors',
            localField: 'slot.floor',
            foreignField: '_id',
            as: 'floorDetails'
          }
        },
        {
          $lookup: {
            from: 'parckingcategories',
            localField: 'type',
            foreignField: '_id',
            as: 'type'
          }
        },
        {
          $lookup: {
            from: "parckingplaces",
            localField: "place",
            foreignField: "_id",
            as: 'place'
          }
        },
        {
          $match: match
        },
        {
          $group: {
            _id: {
              place: "$place.name",
              floor: "$floorDetails.name",
              category: "$type.type",
              slot: "$slot.name",
              vehicle_Number: "$vehicle_Number",
              Amount: "$payable_amount",
              Paid: "$paid_amount",
              in_time: "$in_time",
              out_time: "$out_time"
            },
            totalPaid: { $sum: "$paid_amount" },
            totalAmount: { $sum: "$payable_amount" },
          }
        },
        {
          $project: {
            _id: 0,
            place: "$_id.place",
            category: "$_id.category",
            floor: "$_id.floor",
            slot: "$_id.slot",
            vehicle_Number: {
              $ifNull: [ "$_id.vehicle_Number", "" ]
            },
            Amount: {
              $ifNull: [ "$_id.Amount", 0 ]
            },
            Paid: {
              $ifNull: [ "$_id.Paid", 0 ]
            },
            in_time: {
              $ifNull: [ "$_id.in_time", "" ]
            },
            out_time: {
              $ifNull: [ "$_id.out_time", "" ]
            },
            totalPaid: 1,
            totalAmount: 1,
          }
        },
        {
          $group: {
            _id: null,
            totalPaid: { $sum: "$totalPaid" },
            totalAmount: { $sum: "$totalAmount" },
            count: { $sum: "$count" },
            details: { $push: "$$ROOT" }
          }
        },
        {
          $project: {
            _id: 0,
            totalPaid: 1,
            totalAmount: 1,
            details: 1
          }
        }
      ])
      return detailsReport
    }
}
