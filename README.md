# Table
DreamFactory table management from Angular

The purpose of the project is to have access to data from DreamFactory  ( https://www.dreamfactory.com/ ) as a middleware from Angular4.

First you have to have an Dreamfactory instance, could be in the cloud or local.
You can follow the instructions from the "Address book" example to setup an instance of DreamFactory in: https://github.com/dreamfactorysoftware/angular2-sdk 

1 To run the program you have to change app/config/constants.ts to the new generated instance. This is a local hosted example but you have to change API_KEY:

export const DREAMFACTORY_API_KEY: string = '90ae02f7ec90952ddc7937e733cccde7c49d5a4afd04fd4f5ee9988a5147e420';
export const DREAMFACTORY_INSTANCE_URL: string = 'http://localhost:81';

The project support "string", "integer", "float" and "reference" data types.
You can adapt the project to a new supported type modifiying the files "dynamic-input.component.html" and "check-type.services.ts"

---------------------------
