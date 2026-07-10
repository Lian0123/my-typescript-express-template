/* Import Package */
import { ApiModel } from 'swagger-express-ts';

/* Type & Interface */
import { TimeSeriesSamplePO, TimeSeriesSamplesPO, TimeSeriesSummaryItemPO, TimeSeriesSummaryPO } from '../po/time-series.po';

@ApiModel({
  description: 'Time series sample BO'
})
export class TimeSeriesSampleBO extends TimeSeriesSamplePO {
  static plainToClass (bo:any): TimeSeriesSampleBO {
    return TimeSeriesSamplePO.plainToClass(bo) as TimeSeriesSampleBO;
  }
}

export class TimeSeriesSamplesBO extends TimeSeriesSamplesPO {
  static plainToClass (bo:any): TimeSeriesSamplesBO {
    return TimeSeriesSamplesPO.plainToClass(bo) as TimeSeriesSamplesBO;
  }
}

@ApiModel({
  description: 'Time series summary item BO'
})
export class TimeSeriesSummaryItemBO extends TimeSeriesSummaryItemPO {
  static plainToClass (bo:any): TimeSeriesSummaryItemBO {
    return TimeSeriesSummaryItemPO.plainToClass(bo) as TimeSeriesSummaryItemBO;
  }
}

@ApiModel({
  description: 'Time series summary BO'
})
export class TimeSeriesSummaryBO extends TimeSeriesSummaryPO {
  static plainToClass (bo:any): TimeSeriesSummaryBO {
    return TimeSeriesSummaryPO.plainToClass(bo) as TimeSeriesSummaryBO;
  }
}
