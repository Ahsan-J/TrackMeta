import { IsDefined, IsISRC, IsNotEmpty, IsString } from "class-validator";
import { Track } from "./track.entity";

export class CreateMetaBody {

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    @IsISRC()
    isrc: Track['isrc'];
}