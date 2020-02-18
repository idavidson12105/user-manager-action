import axios from 'axios';
import util from 'util';
import MSSQLClient from './mssqlClient';
import LDAPClient from './ldapClient';
import Logger from './logger';
import { Instance, InstanceGroups } from './interfaces';

export default class Operations {
    private readonly _mssqlClient: MSSQLClient;
    private readonly _ldapClient: LDAPClient;

    constructor() {
        this._mssqlClient = new MSSQLClient();
        this._ldapClient = new LDAPClient();
    }

    /* Handle conversation initiation by the bot (from scheduler) */
    public async handleBotInit(): Promise<any[]> {
        const usersBPD = [];
        try {
            const usersData = await this._ldapClient.replaceKeys(await this._mssqlClient.getUsersData());

            for (let upn in usersData)
                usersBPD.push({
                    attachments: [],
                    data: {
                        actionsFromWatson: [],
                        businessContext: {},
                        conversationID: '',
                        initiator: 'bot',
                        isFirst: true,
                        watsonContext: {
                            instances: usersData[upn]
                        },
                        watsonID: '',
                    },
                    message: 'init',
                    project: process.env.PROJECT,
                    sessionID: '',
                    status: '',
                    userID: upn
                });
            return usersBPD;
        }
        catch (err) {
            Logger.error(err);
            return [];
        }
    }

    public generateCard(instances: Instance[]): string {
        const cardTemplateStr = JSON.stringify(require('../card_templates/cardTemplate.json')),
            textCellTemplateStr = JSON.stringify(require('../card_templates/textCellTemplate.json')),
            hiddenFieldTemplateStr = JSON.stringify(require('../card_templates/hiddenFieldTemplate.json')),
            scheduleCellTemplateStr = JSON.stringify(require('../card_templates/scheduleCellTemplate.json'));
        let instancesReplace = '',
            idsReplace = '',
            hiddenReplace = '',
            schedulesReplace = '';
        instances.forEach((instance, i) => {
            instancesReplace += textCellTemplateStr.replace('{text}', instance.name) ;
            idsReplace += textCellTemplateStr.replace('{text}', instance.id);
            hiddenReplace += hiddenFieldTemplateStr.replace('{id}', instance.id).replace('{value}', Buffer.from(JSON.stringify(instance)).toString('base64'));
            schedulesReplace += scheduleCellTemplateStr.replace('{id}', `schedule-${instance.id}`);
            if (i < instances.length - 1) {
                instancesReplace += ',';
                idsReplace += ',';
                hiddenReplace += ',';
                schedulesReplace += ',';
            }
        });
        return cardTemplateStr
            .replace('"{instances}"', instancesReplace)
            .replace('"{ids}"', idsReplace)
            .replace('"{hidden}"', hiddenReplace)
            .replace('"{schedules}"', schedulesReplace);
    }

    /* Update given instances with given schedules */
    public async updateUserInstances(bpData: any): Promise<boolean> {
        Logger.info(util.inspect(bpData.data.watsonContext.instances, { depth: 10, colors: true }));
        return true;
        // const instances = bpData.data.watsonContext.instances,
        //     groupByAccountId: InstanceGroups = {};
        // instances.forEach(instance => {
        //     groupByAccountId[instance.accountId] = groupByAccountId[instance.accountId] || [];
        //     groupByAccountId[instance.accountId].push(instance);
        // });
        // for (const instances of Object.values(groupByAccountId)) {
        //     const groupByRegion: InstanceGroups = {};
        //     instances.forEach(instance => {
        //         groupByRegion[instance.region] = groupByRegion[instance.region] || [];
        //         groupByRegion[instance.region].push(instance);
        //     });
        //     for (const instances of Object.values(groupByRegion)) {
        //         const groupByScheduler: InstanceGroups = {};
        //         instances.forEach(instance => {
        //             groupByScheduler[instance.schedule] = groupByScheduler[instance.schedule] || [];
        //             groupByScheduler[instance.schedule].push(instance);
        //         });
        //         for (const instances of Object.values(groupByScheduler)) {
        //             await this._updateInstanceGroup(instances);
        //         }
        //     }
        // };
        // // Logger.error('Error updating user instances: ', `userPrincipalName ${bpData.userID}`, err);
    }

    // private async _updateInstanceGroup(instances: Instance[]): Promise<boolean> {
    //     const accountId = instances[0].accountId;
    //     instances.reduce((queryString, instance) => {
    //         return queryString + `accountid=$`
    //     }, '?');
    //     await axios.post(process.env.INSTANCE_MANAGEMENT_API_BASE_URL + `?accountid=${watsonContext.accountId}`);
    // }
}
