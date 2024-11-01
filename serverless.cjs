//const platform = require('os');

const fs = require('fs');
const path = require('path');

const serverless = {
    service: 'datalake-import-rbnz',

    frameworkVersion: '3',

    plugins: [
        'serverless-offline',
        //'serverless-esbuild'
    ],

    custom: {
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            target: 'node20',
            platform: 'node'
            //external: ['aws-sdk']
        },
        // webpack: {
        //     webpackConfig: 'webpack.config.cjs',
        //     includeFiles: 'config/*.json',
        //     includeModules: true,
        //     packager: 'npm',
        //     plugins: [
        //         new CopyPlugin({
        //             patterns: [
        //                 'config/*.json'
        //             ],
        //         }),
        //     ],
        // },
    },

    provider: {
        name: 'aws',
        runtime: 'nodejs20.x',
        endpointType: 'REGIONAL',
        region: require('./src/config/config.json').aws.region,
        stage: 'prod',
        tags: {
            project: 'datalake',
            instance: 'rbnz-raw',
            env: '${self:provider.stage}'
        },
        deploymentPrefix: '${self:provider.tags.project}-${self:provider.tags.instance}-${self:provider.tags.env}',
        deploymentBucket: {
            name: 'infra-deploy-all',
            maxPreviousDeploymentArtifacts: 2,
            blockPublicAccess: true,
            versioning: false
        },
        iamRoleStatements: [
            {
                Effect: 'Allow',
                Action: [
                    's3:GetObject',
                    's3:PutObject'
                ],
                Resource: `arn:aws:s3:::${require('./src/config/config.json').bucketName}/${require('./src/config/config.json').bucketRootPrefix}/*`
            },
            {
                Effect: 'Allow',
                Action: [
                    'logs:CreateLogGroup',
                    'logs:CreateLogStream',
                    'logs:PutLogEvents'
                ],
                Resource: '*'
            }
        ],
        vpc: {
            securityGroupIds: require('./src/config/config.json').aws.vpcSecurityGroupIds,
            subnetIds: require('./src/config/config.json').aws.vpcSubnetIds
        },
        apiGateway: {
            shouldStartNameWithService: true,
            //basePath: ''
            // apiKeys: [
            //     'datalake-import-rbnz'
            // ]
        }
    },

    package: {
        //excludeDevDependencies: true,
        //individually: true,
        exclude: [
            'test/**',
            'infra/**',
            'node_modules/**',
            'buildspec.yml',
            'nodemon.json',
            '*.todo',
            '*.md',
            '*.ncg.json',
            '*.txt',
            '*.log'
        ]
    },

    functions: {
        status: {
            handler: 'src/handlers/status.handler',
            description: 'Get the status of the service',
            memorySize: 128,
            events: [
                {
                    http: {
                        path: 'status',
                        method: 'get',
                        private: true,
                        cors: true
                    }
                }
            ]
        },
        downloadOcr: {
            handler: 'src/handlers/downloadOcr.handler',
            description: 'Download the raw ocr web page',
            memorySize: 128,
            events: [
                {
                    http: {
                        path: 'downloadOcr',
                        method: 'post',
                        private: true,
                        cors: true
                    }
                },
                {
                    schedule: {
                        rate: 'cron(0 13 * * ? *)',
                        enabled: true
                    }
                }
            ]
        }
    }
};

async function generateExport() {
    const result = serverless;
    console.log(JSON.stringify(result, null, 4));
    return result;
}

module.exports = generateExport();

