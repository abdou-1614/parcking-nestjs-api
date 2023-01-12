import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Slot, SlotDocument } from './schema/slot.schema';

@Injectable()
export class SlotService {
    constructor( @InjectModel(Slot.name) private readonly slotModel: Model<SlotDocument> ){}

    async createSlot(){
        try{
            
        }catch(e){

        }
    }
}
