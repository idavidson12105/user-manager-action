import { Client } from 'ldapts';
import Logger from './logger';
import { InstanceGroups } from './interfaces';

export default class LDAPClient {
    private readonly _client: Client;

    constructor() {
        this._client = new Client({ url: process.env.LDAP_URL });
    }

    public async replaceKeys(usersData: InstanceGroups): Promise<InstanceGroups> {
        let filter = '';
        try {
            await this._bindClient();
            for (const ntnet in usersData)
                filter += `(sAMAccountName=${ntnet})`;
            const { searchEntries } = await this._client.search(
                process.env.LDAP_SEARCH_DN,
                {
                    attributes: ['userPrincipalName', 'sAMAccountName'],
                    filter: `(|${filter})`
                }
            );
            return searchEntries.reduce((results, entry) => {
                results[entry['userPrincipalName'].toString()] = usersData[entry['sAMAccountName'].toString().toUpperCase()];
                return results;
            }, {});
        } catch (err) {
            Logger.error('Error fetching data from Active Directory: ', err);
            return null;
        } finally {
            await this._unbindClient();
        }
    }

    private async _bindClient(): Promise<void> {
        await this._client.bind(process.env.LDAP_BIND_DN, process.env.LDAP_PASSWORD);
    }

    private async _unbindClient(): Promise<void> {
        await this._client.unbind();
    }
}