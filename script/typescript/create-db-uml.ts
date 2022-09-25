/* Import Package */
import { EOL } from 'os';
import { createConnection } from 'typeorm';
import { Direction, Flags, Format, TypeormUml } from 'typeorm-uml';

/* Config & Environment Variables */
import { typeOrmConfig } from '../../src/typeorm-config';
const { PLANTUML_SERVER_MAPPING_PORT } = process.env;

(async () => {
    const connection = await createConnection(typeOrmConfig);
    const flags: Flags = {
        direction: Direction.LR,
        format: Format.SVG,
        handwritten: true,
        "plantuml-url": PLANTUML_SERVER_MAPPING_PORT,
    };

    const typeormUml = new TypeormUml();
    const url = await typeormUml.build( connection, flags );
    process.stdout.write( 'Diagram URL: ' + url + EOL );
})();