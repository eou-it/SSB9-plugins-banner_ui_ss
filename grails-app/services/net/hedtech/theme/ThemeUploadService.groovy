package net.hedtech.theme

import net.hedtech.dbservice.BaseDbService

class ThemeUploadService extends BaseDbService{
    public ThemeUploadService(){
        super(ThemeUpload.class)
    }

    ThemeUpload saveTheme (String fileName, def clobData, String type){
        ThemeUpload uploadFile = new ThemeUpload();
        List uploadList = []
        uploadFile.setAppId(fileName)
        uploadFile.setConfigName(fileName)
        uploadFile.setConfigType(type)
        uploadFile.setActivityDate(new java.util.Date())
        uploadFile.setFile(sessionFactory.getCurrentSession().getLobHelper().createClob(clobData))
        uploadList.add(uploadFile);
        try {
            save(uploadList);
        }catch(e){
            e.printStackTrace();
        }

    }
}
