import { IsLatitude, IsLongitude, IsNumber, IsString, Max, Min } from "class-validator";

export class CreateReportDto {

    @IsNumber()
    @Min(0)
    @Max(1000000)
    price: number;

    // make = contructeur, marque - Hyundai, Toyota, ...
    @IsString()
    make: string;   

    @IsString()
    model: string;

    @IsNumber()
    @Min(1900)
    @Max(2050)
    year: number;
    
    @IsLongitude()
    longitude: number;

    @IsLatitude()
    latitude: number;

    @IsNumber()
    @Min(0)
    @Max(1000000)
    mileage: number;

}