import { BaseModel } from "../../helper/model";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";
import { Artist } from "./artist.entity";
import { Images } from "./images.entity";

@Entity()
export class Track extends BaseModel {
    
    @PrimaryColumn()
    isrc: string;

    @OneToMany(() => Images, images => images.meta)
    images: Images[];

    @ManyToMany(() => Artist)
    @JoinTable()
    artist: Artist[];

    @Column()
    title: string;
}