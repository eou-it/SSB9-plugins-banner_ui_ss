package net.hedtech.theme

import grails.transaction.Transactional
import groovy.sql.Sql

import java.sql.Date
@Transactional
class ThemeUploadService {
    def serviceMethod() {

    }
    def sessionFactory

    ThemeUpload saveTheme (String fileName, byte[] file, String type){
        ThemeUpload uploadFile = new ThemeUpload();
        uploadFile.setFile(file)
        uploadFile.setAppId(fileName)
        uploadFile.setConfigName(fileName)
        uploadFile.setConfigType(type)
        uploadFile.setActivityDate(new java.util.Date())
        org.hibernate.classic.Session session = sessionFactory.currentSession
        try {
            session.saveOrUpdate(uploadFile)
        }catch(Exception e){
            e.printStackTrace();
        }

    }
}
