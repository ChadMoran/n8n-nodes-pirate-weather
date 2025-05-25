import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

export class PirateWeather implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Pirate Weather',
		name: 'pirateWeather',
		icon: 'file:pirateweather.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Get weather forecasts and historical weather data from Pirate Weather API',
		defaults: {
			name: 'Pirate Weather',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'pirateWeatherApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$parameter["resource"] === "timeMachine" ? "https://timemachine.pirateweather.net" : "https://api.pirateweather.net"}}',
			headers: {
				Accept: 'application/json',
			},
		},
		properties: [
			// Resource selection
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Forecast',
						value: 'forecast',
						description: 'Get current and forecasted weather data',
					},
					{
						name: 'Time Machine',
						value: 'timeMachine',
						description: 'Get historical weather data for a specific time',
					},
				],
				default: 'forecast',
			},

			// Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['forecast'],
					},
				},
				options: [
					{
						name: 'Get Forecast',
						value: 'getForecast',
						description: 'Get weather forecast data',
						action: 'Get weather forecast',
						routing: {
							request: {
								method: 'GET',
								url: '/forecast/{{$credentials.apiKey}}/{{$parameter.latitude}},{{$parameter.longitude}}',
								qs: {
									units: '={{$parameter.additionalFields.units || undefined}}',
									exclude: '={{$parameter.additionalFields.exclude?.join(",") || undefined}}',
									extend: '={{$parameter.additionalFields.extend || undefined}}',
									lang: '={{$parameter.additionalFields.lang || undefined}}',
									version: '={{$parameter.additionalFields.version || undefined}}',
									icon: '={{$parameter.additionalFields.icon || undefined}}',
								},
							},
						},
					},
				],
				default: 'getForecast',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['timeMachine'],
					},
				},
				options: [
					{
						name: 'Get Historical',
						value: 'getHistorical',
						description: 'Get historical weather data',
						action: 'Get historical weather',
						routing: {
							request: {
								method: 'GET',
								url: '/forecast/{{$credentials.apiKey}}/{{$parameter.latitude}},{{$parameter.longitude}},{{Math.floor(new Date($parameter.time).getTime() / 1000)}}',
								qs: {
									units: '={{$parameter.additionalFields.units || undefined}}',
									exclude: '={{$parameter.additionalFields.exclude?.join(",") || undefined}}',
									lang: '={{$parameter.additionalFields.lang || undefined}}',
									version: '={{$parameter.additionalFields.version || undefined}}',
									icon: '={{$parameter.additionalFields.icon || undefined}}',
								},
							},
						},
					},
				],
				default: 'getHistorical',
			},

			// Latitude
			{
				displayName: 'Latitude',
				name: 'latitude',
				type: 'number',
				default: 37.8267,
				required: true,
				description: 'The latitude of the location',
				displayOptions: {
					show: {
						operation: ['getForecast', 'getHistorical'],
					},
				},
			},

			// Longitude
			{
				displayName: 'Longitude',
				name: 'longitude',
				type: 'number',
				default: -122.4233,
				required: true,
				description: 'The longitude of the location',
				displayOptions: {
					show: {
						operation: ['getForecast', 'getHistorical'],
					},
				},
			},

			// Time (for Time Machine only)
			{
				displayName: 'Time',
				name: 'time',
				type: 'dateTime',
				default: '',
				required: true,
				description: 'The time for which to retrieve weather data (UNIX timestamp or ISO 8601)',
				displayOptions: {
					show: {
						resource: ['timeMachine'],
						operation: ['get'],
					},
				},
			},

			// Additional Fields
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						operation: ['getForecast', 'getHistorical'],
					},
				},
				options: [
					{
						displayName: 'Units',
						name: 'units',
						type: 'options',
						options: [
							{
								name: 'Auto (Based on Location)',
								value: 'auto',
							},
							{
								name: 'CA (SI, km/h)',
								value: 'ca',
							},
							{
								name: 'UK (SI, mph)',
								value: 'uk',
							},
							{
								name: 'US (Imperial)',
								value: 'us',
							},
							{
								name: 'SI',
								value: 'si',
							},
						],
						default: 'auto',
						description: 'Units for the weather data',
					},
					{
						displayName: 'Exclude',
						name: 'exclude',
						type: 'multiOptions',
						options: [
							{
								name: 'Currently',
								value: 'currently',
							},
							{
								name: 'Minutely',
								value: 'minutely',
							},
							{
								name: 'Hourly',
								value: 'hourly',
							},
							{
								name: 'Daily',
								value: 'daily',
							},
							{
								name: 'Alerts',
								value: 'alerts',
							},
						],
						default: [],
						description: 'Exclude specific data blocks from the response',
					},
					{
						displayName: 'Extend',
						name: 'extend',
						type: 'options',
						options: [
							{
								name: 'None',
								value: '',
							},
							{
								name: 'Hourly (168 hours)',
								value: 'hourly',
							},
						],
						default: '',
						description: 'Extend the hourly forecast',
					},
					{
						displayName: 'Language',
						name: 'lang',
						type: 'options',
						options: [
							{ name: 'Arabic', value: 'ar' },
							{ name: 'Bosnian', value: 'bs' },
							{ name: 'Chinese Simplified', value: 'zh' },
							{ name: 'Chinese Traditional', value: 'zh-tw' },
							{ name: 'Czech', value: 'cs' },
							{ name: 'Danish', value: 'da' },
							{ name: 'Dutch', value: 'nl' },
							{ name: 'English', value: 'en' },
							{ name: 'Estonian', value: 'et' },
							{ name: 'Finnish', value: 'fi' },
							{ name: 'French', value: 'fr' },
							{ name: 'German', value: 'de' },
							{ name: 'Greek', value: 'el' },
							{ name: 'Hebrew', value: 'he' },
							{ name: 'Hindi', value: 'hi' },
							{ name: 'Hungarian', value: 'hu' },
							{ name: 'Icelandic', value: 'is' },
							{ name: 'Indonesian', value: 'id' },
							{ name: 'Italian', value: 'it' },
							{ name: 'Japanese', value: 'ja' },
							{ name: 'Korean', value: 'ko' },
							{ name: 'Norwegian', value: 'nb' },
							{ name: 'Polish', value: 'pl' },
							{ name: 'Portuguese', value: 'pt' },
							{ name: 'Russian', value: 'ru' },
							{ name: 'Slovak', value: 'sk' },
							{ name: 'Spanish', value: 'es' },
							{ name: 'Swedish', value: 'sv' },
							{ name: 'Turkish', value: 'tr' },
							{ name: 'Ukrainian', value: 'uk' },
						],
						default: 'en',
						description: 'Language for text summaries',
					},
					{
						displayName: 'Version',
						name: 'version',
						type: 'options',
						options: [
							{
								name: 'Version 1',
								value: '',
							},
							{
								name: 'Version 2 (Additional Fields)',
								value: '2',
							},
						],
						default: '',
						description: 'API version (v2 includes additional fields like smoke and fireIndex)',
					},
					{
						displayName: 'Icon Style',
						name: 'icon',
						type: 'options',
						options: [
							{
								name: 'Default',
								value: '',
							},
							{
								name: 'Pirate (Expanded Set)',
								value: 'pirate',
							},
						],
						default: '',
						description: 'Icon style for weather conditions',
					},
				],
			},
		],
	};
}