import { EOL } from 'os';

import { Direction, Flags, Format, TypeormUml } from 'typeorm-uml';
import { createConnection } from 'typeorm';
import {typeOrmConfig} from '../../src/typeorm-config';

(async () => {
    const connection = await createConnection(typeOrmConfig);
    const flags: Flags = {
        direction: Direction.LR,
        format: Format.SVG,
        handwritten: true,
        "plantuml-url":`${process.env.PLANTUML_SERVER_MAPPING_PORT}`,
    };

    const typeormUml = new TypeormUml();
    const url = await typeormUml.build( connection, flags );
    process.stdout.write( 'Diagram URL: ' + url + EOL );
})()