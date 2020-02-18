import { ConnectionPool } from 'mssql';
import Logger from './logger';
import { InstanceGroups } from './interfaces';

export default class MSSQLClient {
    private _client: ConnectionPool;

    constructor() {
        new ConnectionPool({
            user: process.env.MSSQL_USER,
            password: process.env.MSSQL_PASS,
            server: process.env.MSSQL_HOST,
            database: process.env.MSSQL_DB_NAME
        }).connect().then(
            res => {
                Logger.info('Successfully connected to MS SQL server');
                this._client = res;
            },
            err => Logger.error('MSSQL Connection Error', err)
        );
    }

    /* Get a hash of all instance owners and their data */
    public async getUsersData(): Promise<InstanceGroups> {
        try {
            const queryResult = await (this._client.request().query(
                `SELECT InstanceId, InstanceName, OlfAccountId, Ntnet
                 FROM ${process.env.MSSQL_VIEW_NAME}
                 WHERE Ntnet IS NOT NULL
                 ORDER BY Ntnet`
            ));
            return queryResult.recordset.reduce((usersData, record) => {
                const ntnet = record.Ntnet.toUpperCase();
                usersData[ntnet] = usersData[ntnet] || [];
                usersData[ntnet].push({
                    accountId: record.OlfAccountId,
                    id: record.InstanceId,
                    name: record.InstanceName
                    //region: record.Region
                });
                return usersData;
            }, {});
        }
        catch (err) {
            Logger.error('MSSQL Error', err);
            return {};
        }
    }
}
