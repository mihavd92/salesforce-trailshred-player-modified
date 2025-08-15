import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getSettings from '@salesforce/apex/TrailshredController.getSettings';

export default class TrailshredRecordForm extends NavigationMixin(LightningElement) {

    @api recordId;
    @api objectApiName;
    @api mode = 'view';
    @api layoutColumns = 2;
    @api layoutType = 'Full';

    trailshredFieldValueSettings = [];
    recordCache = [];

    connectedCallback() {
        const that = this;
        getSettings({ objectApiName: this.objectApiName })
            .then(response => that.onSettingsLoaded(response))
            .catch(error => { throw error; });
    }

    onRecordLoad(event) {
        const record = (event.detail && event.detail.records && event.detail.records[this.recordId]);
        this.addRecordToCache(record);
        this.handleRecordFields(record);
    }

    handleRecordFields(newRecord) {
    if (!newRecord || !this.trailshredFieldValueSettings || this.trailshredFieldValueSettings.length === 0) {
        return;
    }

    const audios = [];
    const oldRecord = this.recordCache.find(record => record.systemModstamp < newRecord.systemModstamp);

    if (oldRecord && newRecord) {
        this.clearRecordCache();
        this.addRecordToCache(newRecord);

        const specificValueSettings = this.trailshredFieldValueSettings.filter(s => s.Field_Value__c && s.Field_Value__c.trim() !== '');
        const anyValueSettings = this.trailshredFieldValueSettings.filter(s => !s.Field_Value__c || s.Field_Value__c.trim() === '');

        let matched = false;

        for (let setting of specificValueSettings) {
            let fieldName = setting.Field_Name__r.QualifiedApiName;
            if (fieldName.startsWith(this.objectApiName + '.')) {
                fieldName = fieldName.substring(this.objectApiName.length + 1);
            }
            const lookupFieldName = this.getLookupFieldName(fieldName);

            const oldFieldValue = String((oldRecord.fields[fieldName]?.value) || '');
            const newFieldValue = String((newRecord.fields[fieldName]?.value) || '');
            const newFieldDisplayValue = String(
                (newRecord.fields[fieldName]?.displayValue) ||
                (newRecord.fields[lookupFieldName]?.displayValue)
            );

            const fieldValueChanged = oldFieldValue !== newFieldValue;
            const targetValue = setting.Field_Value__c;
            const matchCondition = fieldValueChanged && (newFieldValue === targetValue || newFieldDisplayValue === targetValue);

            if (matchCondition) {
                audios.push(new Audio('/resource/' + setting.Audio_Static_Resource_Path__c));
                matched = true; // конкретне правило спрацювало
            }
        }

        if (!matched) {
            for (let setting of anyValueSettings) {
                let fieldName = setting.Field_Name__r.QualifiedApiName;
                if (fieldName.startsWith(this.objectApiName + '.')) {
                    fieldName = fieldName.substring(this.objectApiName.length + 1);
                }

                const lookupFieldName = this.getLookupFieldName(fieldName);
                const oldFieldValue = String((oldRecord.fields[fieldName]?.value) || '');
                const newFieldValue = String((newRecord.fields[fieldName]?.value) || '');
                const newFieldDisplayValue = String(
                    (newRecord.fields[fieldName]?.displayValue) ||
                    (newRecord.fields[lookupFieldName]?.displayValue)
                );

                const fieldValueChanged = oldFieldValue !== newFieldValue;
                if (fieldValueChanged) {
                    audios.push(new Audio('/resource/' + setting.Audio_Static_Resource_Path__c));
                }
            }
        }
    } else {
        this.addRecordToCache(newRecord);
    }

    if (audios.length > 0) {
        this.playAudioFilesInSequence(audios)();
    }
}

    onSettingsLoaded(settings) {
        if (settings && settings.length > 0) {
            this.trailshredFieldValueSettings = settings.filter(setting => {
                return (
                    setting.Active__c &&
                    setting.Audio_Static_Resource_Path__c &&
                    setting.Object_Name__c &&
                    setting.Object_Name__r &&
                    setting.Object_Name__r.QualifiedApiName === this.objectApiName &&
                    setting.Field_Name__c &&
                    setting.Field_Name__r &&
                    setting.Field_Name__r.QualifiedApiName
                );
            });
        }
    }

    getLookupFieldName(fieldName) {
        let lookupFieldName = fieldName;
        if (fieldName) {
            let lowercaseFieldName = fieldName.toLowerCase();
            if (lowercaseFieldName.endsWith('id')) {
                lookupFieldName = fieldName.slice(0, -2);
            } else if (lowercaseFieldName.endsWith('__c')) {
                lookupFieldName = fieldName.slice(0, -1) + 'r';
            }
        }
        return lookupFieldName;
    }

    playAudioFilesInSequence(audios, currentIndex = 0) {
        return () => {
            if (currentIndex < audios.length) {
                let audio = audios[currentIndex];
                audio.addEventListener('ended', this.playAudioFilesInSequence(audios, ++currentIndex));
                audio.load();
                audio.play();
            }
        };
    }

    addRecordToCache(record, maxCachedRecords = 5) {
        if (record) this.recordCache.unshift(record);
        this.recordCache.length = Math.min(this.recordCache.length, Math.max(maxCachedRecords, 0));
    }

    clearRecordCache() {
        this.recordCache.length = 0;
    }
}
