package net.hedtech.theme

import grails.transaction.Transactional
import groovy.sql.Sql

import java.sql.Date

class ThemeUploadService {
    def serviceMethod() {

    }
    def sessionFactory

    ThemeUpload saveTheme (String fileName, def clobData, String type){
        ThemeUpload uploadFile = new ThemeUpload();
        uploadFile.setAppId(fileName)
        uploadFile.setConfigName(fileName)
        uploadFile.setConfigType(type)
        uploadFile.setActivityDate(new java.util.Date())
        org.hibernate.classic.Session session = sessionFactory.currentSession
        uploadFile.setFile(session.getLobHelper().createClob(clobData))
        try {
            session.saveOrUpdate(uploadFile)
        }catch(Exception e){
            e.printStackTrace();
        }

    }
}
