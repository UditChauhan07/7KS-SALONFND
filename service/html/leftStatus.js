class LeftStatus {
  constructor() {
  }
  get(data) {
    console.log({data});
    let status = {
      dashboard: false,
      business:false,
      businessChild:{create:false,view:false},
      serviceCat: false,
      serviceCatChild: { create: false, view: false },
      Service: false,
      ServiceChild: { create: false, view: false },
      hairCat: false,
      hairCatChild: { create: false, view: false },
      hairSub: false,
      hairSubChild: { create: false, view: false },
      hairType: false,
      hairTypeChild: { create: false, view: false },
      user: false,
      userChild: { create: false, view: false },
      salon: false,
      salonChild: { create: false, view: false },
      sales: false,
      salesChild: { create: false, view: false },
      admin: false,
      adminChild: { create: false, view: false },
      serviceSub: false,
      serviceSubChild: { create: false, view: false },
      Ethnicity: false,
      EthnicityChild: { create: false, view: false },
      mobileSetting: false,
      setting: false,
    };
    status[data.change] = true;
    if(data.childEffect){
      status[`${data.change}Child`][data.childEffect.name] = true;
    }
    return status;
  }
}
module.exports = LeftStatus;
