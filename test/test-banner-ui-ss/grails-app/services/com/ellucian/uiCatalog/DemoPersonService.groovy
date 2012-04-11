package com.ellucian.uiCatalog

import com.sungardhe.banner.service.ServiceBase
import groovy.sql.Sql

class DemoPersonService extends ServiceBase {

    static transactional = true

    def fetchPersonsCount() {
        def query = """
          select count(spriden_id) as count
            from spriden, sprtele, goremal, spbpers
           where spriden_change_ind is null
             and sprtele_pidm = spriden_pidm
             and spbpers_pidm = spriden_pidm
             and goremal_pidm = spriden_pidm
        """

        def sql = new Sql(sessionFactory.getCurrentSession().connection())

        sql.firstRow(query).count
    }

    def fetchPersons( params ) {
        def pageMaxSize   = params.pageMaxSize.toInteger()
        def pageOffset    = params.pageOffset.toInteger()
        def sortColumn    = params.sortColumn
        def sortDirection = params.sortDirection

        def query = """
            select *
            from (select row_.*,
                         rownum rownum_
                    from (select spriden_pidm as pidm,
                                 spriden_id as bannerId,
                                 spriden_first_name as firstName,
                                 spriden_last_name as lastName,
                                 sprtele_phone_number as phone,
                                 goremal_email_address as email,
                                 spbpers_birth_date as birthDate,
                                 rownum as rnum
                            from spriden, sprtele, goremal, spbpers
                           where spriden_change_ind is null
                             and sprtele_pidm = spriden_pidm
                             and spbpers_pidm = spriden_pidm
                             and goremal_pidm = spriden_pidm
                           order by ${sortColumn} ${sortDirection}) row_
                    where rownum <= ${pageOffset + pageMaxSize})
            where rownum_ > ${pageOffset}
        """

        def sql = new Sql(sessionFactory.getCurrentSession().connection())
        def persons = []

        def cnt = 1;
        sql.eachRow(query.toString()) {
            persons << [
                id:        cnt++,
                bannerId:  it.bannerId,
                firstName: it.firstName,
                lastName:  it.lastName,
                phone:     it.phone,
                email:     it.email,
                birthDate: it.birthDate
            ]
        }

        persons
    }
}
