import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';

@Injectable()
export class ReportsService {

    constructor(@InjectRepository(Report) private repository: Repository<Report>) {}

    public create( reportDto: CreateReportDto ) {
        const report = this.repository.create( reportDto );
        return this.repository.save(report);
    }

}
