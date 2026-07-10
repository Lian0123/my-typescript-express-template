/* Import Package */
import { ApiModel } from 'swagger-express-ts';

/* Type */
import { TimeSeriesMaintenanceResultAO } from '../ao/time-series.maintenance.ao';

@ApiModel({
  description: 'Time series maintenance result BO'
})
export class TimeSeriesMaintenanceResultBO extends TimeSeriesMaintenanceResultAO {
  static plainToClass (bo:any): TimeSeriesMaintenanceResultBO {
    return TimeSeriesMaintenanceResultAO.plainToClass(bo) as TimeSeriesMaintenanceResultBO;
  }
}
