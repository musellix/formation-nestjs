import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Report {

    @PrimaryGeneratedColumn() 
    id: number;

    @Column()
    price: number;

    // make = contructeur - Hyundai, Toyota, ...
    @Column()
    make: string;   

    @Column()
    model: string;

    @Column()
    year: number;
    
    @Column()
    longitude: number;

    @Column()
    latitude: number;

    @Column()
    mileage: number;

}