package net.hedtech.theme

import net.hedtech.dbservice.BaseDbService

class ConfigurationService extends BaseDbService{
    public ConfigurationService(){
        super(Configuration.class)
    }

    Configuration saveTheme (String fileName, def clobData, String type){
        Configuration uploadFile = new Configuration();
        List uploadList = []
        uploadFile.setConfigName(fileName)
        uploadFile.setConfigType(type)
        uploadFile.setActivityDate(new java.util.Date())
        uploadFile.setFile(sessionFactory.getCurrentSession().getLobHelper().createClob(clobData))
        uploadList.add(uploadFile)
        //create(uploadList,true);
        save(uploadList)
    }
}
