import { inputObjectType, objectType } from 'nexus'
import { uniqBy } from 'lodash';


const StaticSetting = objectType({
	name: 'StaticSetting',
	definition(t) {
    t.string("id");    
    t.string("group");    //e.g. legalGround
    t.string("name");     //e.g. consent
    t.string("label");    //e.g. Consent 
    t.string("comment");  //e.g. Consent is a legimited legal ground
    t.string("extra");    //JSON
	}
});

const StaticSettingInput = inputObjectType({
	name: 'StaticSettingInput',
	definition(t) {
		t.field('group', {
			type: 'String'
		});
	}
});

const allSettings = [
  {group: "legalGround", name: "consent", label: "Consent", comment: "The individual has given clear consent for you to process their personal data for a specific purpose.", extra: {specialCategoryCondition: false} },
  {group: "legalGround", name: "contract", label: "Contract", comment: "the processing is necessary for a contract you have with the individual, or because they have asked you to take specific steps before entering into a contract."},
  {group: "legalGround", name: "legalObligation", label: "Legal obligation", comment: "the processing is necessary for you to comply with the law (not including contractual obligations)."},
  {group: "legalGround", name: "vitalInterests", label: "Vital interests", comment: "The processing is necessary to protect someone’s life."},
  {group: "legalGround", name: "publicTask", label: "Public task", comment: "The processing is necessary for you to perform a task in the public interest or for your official functions, and the task or function has a clear basis in law."},
  {group: "legalGround", name: "legitimateInterest", label: "Legitimate interests", comment: "The processing is necessary for your legitimate interests or the legitimate interests of a third party, unless there is a good reason to protect the individual’s personal data which overrides those legitimate interests. (This cannot apply if you are a public authority processing data to perform your official tasks.)."},
  {group: "legalGround", name: "legitimateInterest", label: "Legitimatddde interests", comment: "The processing is necessary for your legitimate interests or the legitimate interests of a third party, unless there is a good reason to protect the individual’s personal data which overrides those legitimate interests. (This cannot apply if you are a public authority processing data to perform your official tasks.)."},

]

function prep(settings){
  //stringify extra field
  let preped = settings.map(function(item, i){
    if(item.extra){item.extra = JSON.stringify(item.extra)}
    item.id = item.group + "_" + item.name
    return item
  })

  //Only unique ID's
  preped = uniqBy(preped, 'id');

  return preped;
}

function staticSettings() {
  return prep(allSettings);
}

function staticSettingsGroup(parent, {where: {group}}, ctx, info) {
  const groupSettings = allSettings.filter(
    setting => setting.group === group
  )

  return prep(groupSettings);
}



module.exports = {StaticSetting, staticSettings, StaticSettingInput, staticSettingsGroup};