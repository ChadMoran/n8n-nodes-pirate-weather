import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PirateWeatherApi implements ICredentialType {
	name = 'pirateWeatherApi';
	displayName = 'Pirate Weather API';
	documentationUrl = 'https://docs.pirateweather.net/en/latest/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your Pirate Weather API key. Get one for free at <a href="https://pirate-weather.apiable.io/" target="_blank">pirate-weather.apiable.io</a>',
		},
	];

	// Pass API key in the ApiKey header instead of URL path
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'ApiKey': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.pirateweather.net',
			url: '/forecast/dummy/37.8267,-122.4233',
		},
	};
}