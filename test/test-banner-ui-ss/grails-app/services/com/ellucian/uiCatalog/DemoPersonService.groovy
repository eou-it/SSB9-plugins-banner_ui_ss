package com.ellucian.uiCatalog

import com.sungardhe.banner.service.ServiceBase
import org.codehaus.groovy.grails.plugins.web.taglib.ValidationTagLib

class DemoPersonService extends ServiceBase {

    static transactional = true

    def localizer = { mapToLocalize ->
        new ValidationTagLib().message( mapToLocalize )
    }

    private def emailPattern = ~/([\w\.]+)@([\w\.]+)/
//    private def phonePattern = ~/1?\s*\W?\s*([2-9][0-8][0-9])\s*\W?\s*([2-9][0-9]{2})\s*\W?\s*([0-9]{4})(\se?x?t?(\d*))?/
    private def phonePattern = ~/[0-9]*/

    def update( newProperties ) {
        def person = peoples.find { it.id == newProperties.id }

        person.messages = []

        newProperties.each { k, v ->
            if (k == "email" && !emailPattern.matcher(v).matches())
                person.messages << [ type: "error", message: localizer(code: "demo.person.invalidEmail") ]

            if (k == "phone" && !phonePattern.matcher(v).matches())
                person.messages << [ type: "error", message: localizer(code: "demo.person.invalidTelephone") ]
        }

        def out = newProperties

        if (person.messages.size() == 0) {
            newProperties.each { k, v ->
                if (!["bannerId", "version", "id"].contains(k))
                    person[k] = v
            }
            person.messages << [ type: "success" ]

            out = person
        } else {
            out.messages = person.messages
        }

        out
    }

    def fetchPersonsCount() {
//        def query = """
//          select count(spriden_id) as count
//            from spriden, sprtele, goremal, spbpers
//           where spriden_change_ind is null
//             and sprtele_pidm = spriden_pidm
//             and spbpers_pidm = spriden_pidm
//             and goremal_pidm = spriden_pidm
//        """
//
//        def sql = new Sql(sessionFactory.getCurrentSession().connection())
//
//        sql.firstRow(query).count

        peoples.size()
    }

    def fetchPersons( params ) {
        def pageMaxSize   = params.pageMaxSize.toInteger()
        def pageOffset    = params.pageOffset.toInteger()
        def sortColumn    = params.sortColumn
        def sortDirection = params.sortDirection

//        def query = """
//            select *
//            from (select row_.*,
//                         rownum rownum_
//                    from (select spriden_pidm as pidm,
//                                 spriden_id as bannerId,
//                                 spriden_first_name as firstName,
//                                 spriden_last_name as lastName,
//                                 sprtele_phone_number as phone,
//                                 goremal_email_address as email,
//                                 spbpers_birth_date as birthDate,
//                                 rownum as rnum
//                            from spriden, sprtele, goremal, spbpers
//                           where spriden_change_ind is null
//                             and sprtele_pidm = spriden_pidm
//                             and spbpers_pidm = spriden_pidm
//                             and goremal_pidm = spriden_pidm
//                           order by ${sortColumn} ${sortDirection}) row_
//                    where rownum <= ${pageOffset + pageMaxSize})
//            where rownum_ > ${pageOffset}
//        """
//
//        def sql = new Sql(sessionFactory.getCurrentSession().connection())
//        def persons = []
//
//        def cnt = 1;
//        sql.eachRow(query.toString()) {
//            persons << [
//                id:        cnt++,
//                bannerId:  it.bannerId,
//                firstName: it.firstName,
//                lastName:  it.lastName,
//                phone:     it.phone,
//                email:     it.email,
//                birthDate: it.birthDate
//            ]
//        }
//
//        persons


        peoples.sortAndPaginate pageMaxSize, pageOffset, sortColumn, sortDirection
    }

    def peoples = [
        [ "id": 1, "bannerId": "1_1DYFMM", "firstName": "lmarinch", "lastName": "1_1DYFMM", "phone": "5550123", "email": "luke.marinchak@sungardhe.com", "birthDate": "05/24/1970" ],
        [ "id": 2, "bannerId": "JWTESTFAC", "firstName": "60 characters first name of  dick jill linda katie kristy jo", "lastName": "60 characters last name of jw test faculty smith jones adams", "phone": "123456789012", "email": "128charactersforemailjwilson@hotmailjwilson@aoljwilson@yahoojwilson@gmailjwilson@sungardhejwilson@comcastjwilson@aldep.com.com.c", "birthDate": null ],
        [ "id": 3, "bannerId": "A00000408", "firstName": "Test2", "lastName": "80293", "phone": "9749823", "email": "dflath@sct.com", "birthDate": "02/03/1978" ],
        [ "id": 4, "bannerId": "A00011150", "firstName": "Mildred", "lastName": "Abangee", "phone": "9190771", "email": "mabaunza@msn.com", "birthDate": "12/02/1971" ],
        [ "id": 5, "bannerId": "A00011108", "firstName": "Miriam", "lastName": "Abaunza", "phone": "9190771", "email": "mabaunza@msn.com", "birthDate": "12/02/1971" ],
        [ "id": 6, "bannerId": "A00012347", "firstName": "Capri", "lastName": "Abdo", "phone": "8618871", "email": "lilpinkpompom777@aol.com", "birthDate": "12/19/1989" ],
        [ "id": 7, "bannerId": "A00012347", "firstName": "Capri", "lastName": "Abdo", "phone": "2975774", "email": "lilpinkpompom777@aol.com", "birthDate": "12/19/1989" ],
        [ "id": 8, "bannerId": "A00011155", "firstName": "Mildred", "lastName": "Abercrombie", "phone": "9190771", "email": "mabaunza@msn.com", "birthDate": "12/02/1971" ],
        [ "id": 9, "bannerId": "A00011162", "firstName": "Milicent", "lastName": "Abercrombie", "phone": "9190771", "email": "mabaunza@msn.com", "birthDate": "12/02/1971" ],
        [ "id": 10, "bannerId": "A00011162", "firstName": "Milicent", "lastName": "Abercrombie", "phone": "9190771", "email": "mabaunza@msn.com", "birthDate": "12/02/1971" ],
        [ "id": 11, "bannerId": "A00011158", "firstName": "Mildred", "lastName": "Aberjian", "phone": "9190771", "email": "mabaunza@msn.com", "birthDate": "12/02/1971" ],
        [ "id": 12, "bannerId": "A00011147", "firstName": "Amanda", "lastName": "Abramson", "phone": "4332389", "email": "amanda9@ucla.edu", "birthDate": "12/07/1984" ],
        [ "id": 13, "bannerId": "P00000010", "firstName": "Samuel1", "lastName": "Adams", "phone": "3334444", "email": "journalist@ed.edu", "birthDate": "02/20/1966" ],
        [ "id": 14, "bannerId": "A00010346", "firstName": "Adam", "lastName": "Adams", "phone": "3690340", "email": "cbstudents@collegeboard.org", "birthDate": "05/03/1985" ],
        [ "id": 15, "bannerId": "A00010346", "firstName": "Adam", "lastName": "Adams", "phone": "7561180", "email": "cbstudents@collegeboard.org", "birthDate": "05/03/1985" ],
        [ "id": 16, "bannerId": "A00010347", "firstName": "Alison", "lastName": "Adams", "phone": "7379795", "email": "cbstudents@collegeboard.org", "birthDate": "08/04/1987" ],
        [ "id": 17, "bannerId": "HOSR24789", "firstName": "Galen", "lastName": "Adams", "phone": "9752563", "email": "gdadams@camp.edu", "birthDate": "09/21/1992" ],
        [ "id": 18, "bannerId": "HOSR24779", "firstName": "Louise", "lastName": "Adams", "phone": "8978974", "email": "ljadams@camp.edu", "birthDate": "09/08/1991" ],
        [ "id": 19, "bannerId": "A00010347", "firstName": "Alison", "lastName": "Adams", "phone": "4847023", "email": "cbstudents@collegeboard.org", "birthDate": "08/04/1987" ],
        [ "id": 20, "bannerId": "A00010346", "firstName": "Adam", "lastName": "Adams", "phone": "7561180", "email": "cbstudents@collegeboard.org", "birthDate": "05/03/1985" ],
        [ "id": 21, "bannerId": "A00001047", "firstName": "Karen", "lastName": "Adamson", "phone": "6206535", "email": "kirwin.adams@adams.nettttttttttttttttttttttttttttt", "birthDate": "02/14/1983" ],
        [ "id": 22, "bannerId": "A00001047", "firstName": "Karen", "lastName": "Adamson", "phone": "6206535", "email": "kirwin.adams@adams.nettttttttttttttttttttttttttttt", "birthDate": "02/14/1983" ],
        [ "id": 23, "bannerId": "A00001047", "firstName": "Karen", "lastName": "Adamson", "phone": "6206535", "email": "kirwin.adams@adams.nettttttttttttttttttttttttttttt", "birthDate": "02/14/1983" ],
        [ "id": 24, "bannerId": "HOSR24772", "firstName": "Matt", "lastName": "Addison", "phone": "2345869", "email": "mraddison@camp.edu", "birthDate": "12/31/1989" ],
        [ "id": 25, "bannerId": "A00010350", "firstName": "Morayo", "lastName": "Adebowale", "phone": "3564479", "email": "cbstudents@collegeboard.org", "birthDate": "09/07/1986" ],
        [ "id": 26, "bannerId": "A00012386", "firstName": "Ben", "lastName": "Agent", "phone": "1231230", "email": "mrahman@aamc.org", "birthDate": "11/24/1976" ],
        [ "id": 27, "bannerId": "032220204", "firstName": "Swati", "lastName": "Aggarwal", "phone": "1231234", "email": "email12344@hotmail.com", "birthDate": "10/06/1985" ],
        [ "id": 28, "bannerId": "A00010351", "firstName": "Dawn", "lastName": "Albert", "phone": "6628136", "email": "cbstudents@collegeboard.org", "birthDate": "03/24/1986" ],
        [ "id": 29, "bannerId": "551779778", "firstName": "Monica", "lastName": "Alborg", "phone": "8270046", "email": "monicaalborg@hotmail.com", "birthDate": "06/28/1982" ],
        [ "id": 30, "bannerId": "551779778", "firstName": "Monica", "lastName": "Alborg", "phone": "9748878", "email": "monicaalborg@hotmail.com", "birthDate": "06/28/1982" ],
        [ "id": 31, "bannerId": "551779778", "firstName": "Monica", "lastName": "Alborg", "phone": "8270046", "email": "malborg@sungardsct.com", "birthDate": "06/28/1982" ],
        [ "id": 32, "bannerId": "551779778", "firstName": "Monica", "lastName": "Alborg", "phone": "9748878", "email": "malborg@sungardsct.com", "birthDate": "06/28/1982" ],
        [ "id": 33, "bannerId": "A00000407", "firstName": "Anthony", "lastName": "Albrezzio", "phone": "9743276", "email": "dflath@sct.com", "birthDate": "08/17/1978" ],
        [ "id": 34, "bannerId": "A00000407", "firstName": "Anthony", "lastName": "Albrezzio", "phone": "9749823", "email": "dflath@sct.com", "birthDate": "08/17/1978" ],
        [ "id": 35, "bannerId": "A00000407", "firstName": "Anthony", "lastName": "Albrezzio", "phone": "9743276", "email": "bzimmer@sct.com", "birthDate": "08/17/1978" ],
        [ "id": 36, "bannerId": "A00000407", "firstName": "Anthony", "lastName": "Albrezzio", "phone": "9749823", "email": "bzimmer@sct.com", "birthDate": "08/17/1978" ],
        [ "id": 37, "bannerId": "A00010470", "firstName": "Jesse", "lastName": "Alexande", "phone": "8652416", "email": "cbstudents@collegeboard.org", "birthDate": "03/17/1985" ],
        [ "id": 38, "bannerId": "510000001", "firstName": "Matthew", "lastName": "Allen", "phone": "5555000", "email": "test@net", "birthDate": "02/14/1963" ],
        [ "id": 39, "bannerId": "510000001", "firstName": "Matthew", "lastName": "Allen", "phone": "1234567", "email": "test@net", "birthDate": "02/14/1963" ],
        [ "id": 40, "bannerId": "510000001", "firstName": "Matthew", "lastName": "Allen", "phone": "1111333", "email": "test@net", "birthDate": "02/14/1963" ],
        [ "id": 41, "bannerId": "510000001", "firstName": "Matthew", "lastName": "Allen", "phone": "1111111", "email": "test@net", "birthDate": "02/14/1963" ],
        [ "id": 42, "bannerId": "510000001", "firstName": "Matthew", "lastName": "Allen", "phone": "5551234", "email": "test@net", "birthDate": "02/14/1963" ],
        [ "id": 43, "bannerId": "510000001", "firstName": "Matthew", "lastName": "Allen", "phone": "5555000", "email": "test@net", "birthDate": "02/14/1963" ],
        [ "id": 44, "bannerId": "510000001", "firstName": "Matthew", "lastName": "Allen", "phone": "5555000", "email": "mattallan@homestyle.net", "birthDate": "02/14/1963" ],
        [ "id": 45, "bannerId": "510000001", "firstName": "Matthew", "lastName": "Allen", "phone": "1111333", "email": "mattallan@homestyle.net", "birthDate": "02/14/1963" ],
        [ "id": 46, "bannerId": "510000001", "firstName": "Matthew", "lastName": "Allen", "phone": "1111111", "email": "mattallan@homestyle.net", "birthDate": "02/14/1963" ],
        [ "id": 47, "bannerId": "510000001", "firstName": "Matthew", "lastName": "Allen", "phone": "5551111", "email": "allen@www.edu", "birthDate": "02/14/1963" ],
        [ "id": 48, "bannerId": "510000001", "firstName": "Matthew", "lastName": "Allen", "phone": "1111333", "email": "allen@www.edu", "birthDate": "02/14/1963" ],
        [ "id": 49, "bannerId": "510000001", "firstName": "Matthew", "lastName": "Allen", "phone": "1234567", "email": "allen@www.edu", "birthDate": "02/14/1963" ],
        [ "id": 50, "bannerId": "510000001", "firstName": "Matthew", "lastName": "Allen", "phone": "5555000", "email": "allen@www.edu", "birthDate": "02/14/1963" ],
        [ "id": 51, "bannerId": "510000001", "firstName": "Matthew", "lastName": "Allen", "phone": "5555000", "email": "mattallan@homestyle.net", "birthDate": "02/14/1963" ],
        [ "id": 52, "bannerId": "510000001", "firstName": "Matthew", "lastName": "Allen", "phone": "5555000", "email": "mattallan@homestyle.net", "birthDate": "02/14/1963" ],
        [ "id": 53, "bannerId": "510000001", "firstName": "Matthew", "lastName": "Allen", "phone": "4441512", "email": "mattallan@homestyle.net", "birthDate": "02/14/1963" ],
        [ "id": 54, "bannerId": "510000001", "firstName": "Matthew", "lastName": "Allen", "phone": "5551234", "email": "mattallan@homestyle.net", "birthDate": "02/14/1963" ],
        [ "id": 55, "bannerId": "510000001", "firstName": "Matthew", "lastName": "Allen", "phone": "4445555", "email": "mattallan@homestyle.net", "birthDate": "02/14/1963" ],
        [ "id": 56, "bannerId": "510000004", "firstName": "Mike", "lastName": "Allen", "phone": "5551212", "email": "mikeya@sctu.edu", "birthDate": "03/25/1985" ],
        [ "id": 57, "bannerId": "510000004", "firstName": "Mike", "lastName": "Allen", "phone": "1234567", "email": "mikeya@sctu.edu", "birthDate": "03/25/1985" ],
        [ "id": 58, "bannerId": "A00033334", "firstName": "Elizabeth", "lastName": "Allen", "phone": "1234567", "email": "eallen@test.com", "birthDate": "04/15/1982" ],
        [ "id": 59, "bannerId": "A00010352", "firstName": "Rachel", "lastName": "Allen", "phone": "7792678", "email": "cbstudents@collegeboard.org", "birthDate": "05/31/1986" ],
        [ "id": 60, "bannerId": "510000001", "firstName": "Matthew", "lastName": "Allen", "phone": "5555000", "email": "allen@www.edu", "birthDate": "02/14/1963" ],
        [ "id": 61, "bannerId": "510000001", "firstName": "Matthew", "lastName": "Allen", "phone": "5555000", "email": "allen@www.edu", "birthDate": "02/14/1963" ],
        [ "id": 62, "bannerId": "510000001", "firstName": "Matthew", "lastName": "Allen", "phone": "4441512", "email": "allen@www.edu", "birthDate": "02/14/1963" ],
        [ "id": 63, "bannerId": "510000001", "firstName": "Matthew", "lastName": "Allen", "phone": "5551234", "email": "allen@www.edu", "birthDate": "02/14/1963" ],
        [ "id": 64, "bannerId": "510000001", "firstName": "Matthew", "lastName": "Allen", "phone": "4445555", "email": "allen@www.edu", "birthDate": "02/14/1963" ],
        [ "id": 65, "bannerId": "510000001", "firstName": "Matthew", "lastName": "Allen", "phone": "1111111", "email": "allen@www.edu", "birthDate": "02/14/1963" ],
        [ "id": 66, "bannerId": "510000001", "firstName": "Matthew", "lastName": "Allen", "phone": "5551111", "email": "mattallan@homestyle.net", "birthDate": "02/14/1963" ],
        [ "id": 67, "bannerId": "510000001", "firstName": "Matthew", "lastName": "Allen", "phone": "1234567", "email": "mattallan@homestyle.net", "birthDate": "02/14/1963" ],
        [ "id": 68, "bannerId": "510000001", "firstName": "Matthew", "lastName": "Allen", "phone": "5555000", "email": "test@net", "birthDate": "02/14/1963" ],
        [ "id": 69, "bannerId": "510000001", "firstName": "Matthew", "lastName": "Allen", "phone": "4441512", "email": "test@net", "birthDate": "02/14/1963" ],
        [ "id": 70, "bannerId": "510000001", "firstName": "Matthew", "lastName": "Allen", "phone": "4445555", "email": "test@net", "birthDate": "02/14/1963" ],
        [ "id": 71, "bannerId": "510000001", "firstName": "Matthew", "lastName": "Allen", "phone": "5551111", "email": "test@net", "birthDate": "02/14/1963" ],
        [ "id": 72, "bannerId": "A00010471", "firstName": "Joel", "lastName": "Alvarez", "phone": "5213452", "email": "cbstudents@collegeboard.org", "birthDate": "06/28/1985" ],
        [ "id": 73, "bannerId": "A00012862", "firstName": "Don 1234567890 1234567890 1234567890 1234567890 1234567890", "lastName": "Amix 1234567890 1234567890 1234567890 1234567890 1234567890", "phone": "TEXAS", "email": "texas@usa.org", "birthDate": "09/25/1958" ],
        [ "id": 74, "bannerId": "A00013147", "firstName": "Jon", "lastName": "Amyx", "phone": "5555555", "email": "jamyx@aol.com", "birthDate": "12/21/1977" ],
        [ "id": 75, "bannerId": "A00010353", "firstName": "Laurel", "lastName": "Anderson", "phone": "7385285", "email": "cbstudents@collegeboard.org", "birthDate": "04/23/1987" ],
        [ "id": 76, "bannerId": "A00012328", "firstName": "Alfred", "lastName": "Anderson", "phone": "2344433", "email": "al@alsforeignemailaddress.org", "birthDate": "02/09/1979" ],
        [ "id": 77, "bannerId": "A00012328", "firstName": "Alfred", "lastName": "Anderson", "phone": "6666666", "email": "al@alsforeignemailaddress.org", "birthDate": "02/09/1979" ],
        [ "id": 78, "bannerId": "A00012967", "firstName": "Michael Joseph Leon Reginaldobaa with a very long first name", "lastName": "Anderson", "phone": "123456789123", "email": "michael_with_a_very_long_email_address_to_test_email_extract_of_full_details@test.comXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXZZZ", "birthDate": null ],
        [ "id": 79, "bannerId": "A00012967", "firstName": "Michael Joseph Leon Reginaldobaa with a very long first name", "lastName": "Anderson", "phone": "123456789123", "email": "michael_with_a_very_long_email_address_to_test_email_extract_of_full_details@test.comXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXZZZ", "birthDate": null ],
        [ "id": 80, "bannerId": "A00012328", "firstName": "Alfred", "lastName": "Anderson", "phone": "6666666", "email": "al@alsmailingemail.org", "birthDate": "02/09/1979" ],
        [ "id": 81, "bannerId": "A00012328", "firstName": "Alfred", "lastName": "Anderson", "phone": "3455555", "email": "al@alsmailingemail.org", "birthDate": "02/09/1979" ],
        [ "id": 82, "bannerId": "A00012328", "firstName": "Alfred", "lastName": "Anderson", "phone": "2344433", "email": "al@alsmailingemail.org", "birthDate": "02/09/1979" ],
        [ "id": 83, "bannerId": "A00012328", "firstName": "Alfred", "lastName": "Anderson", "phone": "3455555", "email": "al@alsforeignemailaddress.org", "birthDate": "02/09/1979" ],
        [ "id": 84, "bannerId": "A00012328", "firstName": "Alfred", "lastName": "Anderson", "phone": "6666666", "email": "al@alsunitedsstatesemailaddress.org", "birthDate": "02/09/1979" ],
        [ "id": 85, "bannerId": "A00010354", "firstName": "Ryan", "lastName": "Anderson", "phone": "3564479", "email": "cbstudents@collegeboard.org", "birthDate": "04/30/1985" ],
        [ "id": 86, "bannerId": "A00012328", "firstName": "Alfred", "lastName": "Anderson", "phone": "2344433", "email": "al@alsunitedsstatesemailaddress.org", "birthDate": "02/09/1979" ],
        [ "id": 87, "bannerId": "A00012328", "firstName": "Alfred", "lastName": "Anderson", "phone": "3455555", "email": "al@alsunitedsstatesemailaddress.org", "birthDate": "02/09/1979" ],
        [ "id": 88, "bannerId": "A00010355", "firstName": "Stephanie", "lastName": "Andrews", "phone": "2560358", "email": "cbstudents@collegeboard.org", "birthDate": "01/29/1986" ],
        [ "id": 89, "bannerId": "A00010472", "firstName": "Kate", "lastName": "Andrews", "phone": "9623840", "email": "cbstudents@collegeboard.org", "birthDate": "05/07/1984" ],
        [ "id": 90, "bannerId": "A00010356", "firstName": "Maiko", "lastName": "Arashiro", "phone": "6397891", "email": "cbstudents@collegeboard.org", "birthDate": "01/19/1986" ],
        [ "id": 91, "bannerId": "A00010357", "firstName": "Mia", "lastName": "Arreola", "phone": "8323964", "email": "cbstudents@collegeboard.org", "birthDate": "03/25/1987" ],
        [ "id": 92, "bannerId": "A00012623", "firstName": "Nathanial", "lastName": "Arumba", "phone": "5554046", "email": "ikearumba@uwa.ni", "birthDate": "01/19/1980" ],
        [ "id": 93, "bannerId": "A00012623", "firstName": "Nathanial", "lastName": "Arumba", "phone": "5559013", "email": "ikearumba@uwa.ni", "birthDate": "01/19/1980" ],
        [ "id": 94, "bannerId": "A00012623", "firstName": "Nathanial", "lastName": "Arumba", "phone": "5554046", "email": "ikearumba@metu.edu", "birthDate": "01/19/1980" ],
        [ "id": 95, "bannerId": "A00012623", "firstName": "Nathanial", "lastName": "Arumba", "phone": "4834044", "email": "ikearumba@metu.edu", "birthDate": "01/19/1980" ],
        [ "id": 96, "bannerId": "A00012623", "firstName": "Nathanial", "lastName": "Arumba", "phone": "4838000", "email": "ikearumba@metu.edu", "birthDate": "01/19/1980" ],
        [ "id": 97, "bannerId": "A00012806", "firstName": "Nathanial", "lastName": "Arumba", "phone": "4894046", "email": "ikearumba@uwa.ni", "birthDate": null ],
        [ "id": 98, "bannerId": "A00012807", "firstName": "Nathanial", "lastName": "Arumba", "phone": "4834044", "email": "ikearumba@uwa.ni", "birthDate": null ],
        [ "id": 99, "bannerId": "A00012807", "firstName": "Nathanial", "lastName": "Arumba", "phone": "4838000", "email": "ikearumba@uwa.ni", "birthDate": null ],
        [ "id": 100, "bannerId": "A00012807", "firstName": "Nathanial", "lastName": "Arumba", "phone": "4894046", "email": "ikearumba@uwa.ni", "birthDate": null ],
        [ "id": 101, "bannerId": "A00012806", "firstName": "Nathanial", "lastName": "Arumba", "phone": "4838000", "email": "ikearumba@uwa.ni", "birthDate": null ],
        [ "id": 102, "bannerId": "A00012806", "firstName": "Nathanial", "lastName": "Arumba", "phone": "4834044", "email": "ikearumba@uwa.ni", "birthDate": null ],
        [ "id": 103, "bannerId": "A00012623", "firstName": "Nathanial", "lastName": "Arumba", "phone": "4894046", "email": "ikearumba@metu.edu", "birthDate": "01/19/1980" ],
        [ "id": 104, "bannerId": "A00012623", "firstName": "Nathanial", "lastName": "Arumba", "phone": "5559013", "email": "ikearumba@metu.edu", "birthDate": "01/19/1980" ],
        [ "id": 105, "bannerId": "A00012623", "firstName": "Nathanial", "lastName": "Arumba", "phone": "4838000", "email": "ikearumba@uwa.ni", "birthDate": "01/19/1980" ],
        [ "id": 106, "bannerId": "A00012623", "firstName": "Nathanial", "lastName": "Arumba", "phone": "4894046", "email": "ikearumba@uwa.ni", "birthDate": "01/19/1980" ],
        [ "id": 107, "bannerId": "A00012623", "firstName": "Nathanial", "lastName": "Arumba", "phone": "4834044", "email": "ikearumba@uwa.ni", "birthDate": "01/19/1980" ],
        [ "id": 108, "bannerId": "A00011200", "firstName": "Leela", "lastName": "Athalye", "phone": "9333632", "email": "calileela@yahoo.com", "birthDate": "08/25/1984" ],
        [ "id": 109, "bannerId": "A00011733", "firstName": "Leela", "lastName": "Athalye", "phone": "9333632", "email": "calileela@yahoo.com", "birthDate": "08/25/1984" ],
        [ "id": 110, "bannerId": "A00012387", "firstName": "Sam", "lastName": "Atkins", "phone": "8835555", "email": "samuel.au@rogers.com", "birthDate": "11/19/1973" ],
        [ "id": 111, "bannerId": "A00010953", "firstName": "Phyllis", "lastName": "Baers", "phone": "3391020", "email": "pbaers@yahoo.com", "birthDate": "05/01/1964" ],
        [ "id": 112, "bannerId": "A00010953", "firstName": "Phyllis", "lastName": "Baers", "phone": "7732433", "email": "pbaers@yahoo.com", "birthDate": "05/01/1964" ],
        [ "id": 113, "bannerId": "A00010906", "firstName": "Robert", "lastName": "Bahrain", "phone": "5264511", "email": "rbahrain@sungardsct.com", "birthDate": "05/01/1973" ],
        [ "id": 114, "bannerId": "A00010906", "firstName": "Robert", "lastName": "Bahrain", "phone": "2013326", "email": "rbahrain@sungardsct.com", "birthDate": "05/01/1973" ],
        [ "id": 115, "bannerId": "A00010906", "firstName": "Robert", "lastName": "Bahrain", "phone": "9032222", "email": "rbahrain@sungardsct.com", "birthDate": "05/01/1973" ],
        [ "id": 116, "bannerId": "A00010906", "firstName": "Robert", "lastName": "Bahrain", "phone": "9251487", "email": "rbahrain@sungardsct.com", "birthDate": "05/01/1973" ],
        [ "id": 117, "bannerId": "A00010358", "firstName": "Andrea", "lastName": "Bailey", "phone": "5418398", "email": "cbstudents@collegeboard.org", "birthDate": "06/16/1986" ],
        [ "id": 118, "bannerId": "A00010359", "firstName": "Christin", "lastName": "Baker", "phone": "2762529", "email": "cbstudents@collegeboard.org", "birthDate": "03/31/1986" ],
        [ "id": 119, "bannerId": "A00012332", "firstName": "Beverly", "lastName": "Baldacci", "phone": "7777", "email": "bevs@usemail.org", "birthDate": "08/09/1989" ],
        [ "id": 120, "bannerId": "A00012332", "firstName": "Beverly", "lastName": "Baldacci", "phone": "5454", "email": "bevs@usemail.org", "birthDate": "08/09/1989" ],
        [ "id": 121, "bannerId": "A00012332", "firstName": "Beverly", "lastName": "Baldacci", "phone": "6565", "email": "bevs@usemail.org", "birthDate": "08/09/1989" ],
        [ "id": 122, "bannerId": "A00012332", "firstName": "Beverly", "lastName": "Baldacci", "phone": "7777", "email": "bevs@foreignemail.org", "birthDate": "08/09/1989" ],
        [ "id": 123, "bannerId": "A00012332", "firstName": "Beverly", "lastName": "Baldacci", "phone": "6565", "email": "bevs@foreignemail.org", "birthDate": "08/09/1989" ],
        [ "id": 124, "bannerId": "A00012332", "firstName": "Beverly", "lastName": "Baldacci", "phone": "5454", "email": "bevs@mailingemail.org", "birthDate": "08/09/1989" ],
        [ "id": 125, "bannerId": "A00012332", "firstName": "Beverly", "lastName": "Baldacci", "phone": "6565", "email": "bevs@mailingemail.org", "birthDate": "08/09/1989" ],
        [ "id": 126, "bannerId": "A00012332", "firstName": "Beverly", "lastName": "Baldacci", "phone": "7777", "email": "bevs@mailingemail.org", "birthDate": "08/09/1989" ],
        [ "id": 127, "bannerId": "A00012332", "firstName": "Beverly", "lastName": "Baldacci", "phone": "5454", "email": "bevs@foreignemail.org", "birthDate": "08/09/1989" ],
        [ "id": 128, "bannerId": "A00011178", "firstName": "Sarah", "lastName": "Bangladesh", "phone": "9882421", "email": "sarahnangle@hotmail.com", "birthDate": "05/07/1975" ],
        [ "id": 129, "bannerId": "A00011174", "firstName": "Sarah", "lastName": "Bangle", "phone": "9882421", "email": "sarahnangle@hotmail.com", "birthDate": "05/07/1975" ],
        [ "id": 130, "bannerId": "A00011174", "firstName": "Sarah", "lastName": "Bangle", "phone": "9882421", "email": "sarahnangle@hotmail.com", "birthDate": "05/07/1975" ],
        [ "id": 131, "bannerId": "A00011174", "firstName": "Sarah", "lastName": "Bangle", "phone": "9882421", "email": "sarahnangle@hotmail.com", "birthDate": "05/07/1975" ],
        [ "id": 132, "bannerId": "A00011015", "firstName": "Anthony", "lastName": "Barcia", "phone": "2968352", "email": "deltaapplicant@aamc.org", "birthDate": "06/21/1977" ],
        [ "id": 133, "bannerId": "A00010889", "firstName": "Wilton", "lastName": "Barhardt", "phone": "9780525", "email": "wbarhardt@yahoo.com", "birthDate": "05/01/1980" ],
        [ "id": 134, "bannerId": "A00010473", "firstName": "Matt", "lastName": "Barnes", "phone": "5293154", "email": "cbstudents@collegeboard.org", "birthDate": "07/03/1983" ],
        [ "id": 135, "bannerId": "A00010091", "firstName": "Benjamin", "lastName": "Barnyard", "phone": "5623887", "email": "qtcalls@yahoo.com", "birthDate": "05/06/1981" ],
        [ "id": 136, "bannerId": "A00010100", "firstName": "Teddy", "lastName": "Bears", "phone": "4534863", "email": "sarahwolo@bresnan.net", "birthDate": "02/03/1986" ],
        [ "id": 137, "bannerId": "A00012832", "firstName": "Sandra", "lastName": "Beaulac", "phone": "9281902", "email": "sbeaulac@aol.com", "birthDate": "08/10/1973" ],
        [ "id": 138, "bannerId": "A00010926", "firstName": "Bonnie", "lastName": "Bedelia", "phone": "2223333", "email": "bbedelia@sct.com", "birthDate": "05/01/1986" ],
        [ "id": 139, "bannerId": "A00010926", "firstName": "Bonnie", "lastName": "Bedelia", "phone": "7782328", "email": "bbedelia@sct.com", "birthDate": "05/01/1986" ],
        [ "id": 140, "bannerId": "A00010926", "firstName": "Bonnie", "lastName": "Bedelia", "phone": "9632108", "email": "bbedelia@sct.com", "birthDate": "05/01/1986" ],
        [ "id": 141, "bannerId": "A00001051", "firstName": "Richard", "lastName": "Bednarson", "phone": "8501626", "email": "larry@int.net                                    A", "birthDate": "12/31/1982" ],
        [ "id": 142, "bannerId": "A00011014", "firstName": "Shahram", "lastName": "Behshad", "phone": "7444827", "email": "deltaapplicant@aamc.org", "birthDate": "09/17/1970" ],
        [ "id": 143, "bannerId": "A00010360", "firstName": "Zachary", "lastName": "Bell", "phone": "2338657", "email": "cbstudents@collegeboard.org", "birthDate": "05/28/1985" ],
        [ "id": 144, "bannerId": "GBELL1", "firstName": "Grace", "lastName": "Bellingham", "phone": "5221234", "email": "gbellingham@sctu.edu", "birthDate": null ],
        [ "id": 145, "bannerId": "A00010361", "firstName": "Lindsay", "lastName": "Bennett", "phone": "4142543", "email": "cbstudents@collegeboard.org", "birthDate": "10/21/1984" ],
        [ "id": 146, "bannerId": "A00010859", "firstName": "Kirstin", "lastName": "Bennington", "phone": "9228851", "email": "kirsteen.burton@utoronto.ca", "birthDate": "07/04/1969" ],
        [ "id": 147, "bannerId": "A00011176", "firstName": "Gabriel", "lastName": "Berman", "phone": "2362927", "email": "einstein2be@verizon.net", "birthDate": "08/03/1974" ],
        [ "id": 148, "bannerId": "A00011176", "firstName": "Gabriel", "lastName": "Berman", "phone": "2362927", "email": "einstein2be@verizon.net", "birthDate": "08/03/1974" ],
        [ "id": 149, "bannerId": "A00011176", "firstName": "Gabriel", "lastName": "Berman", "phone": "2362927", "email": "einstein2be@verizon.net", "birthDate": "08/03/1974" ],
        [ "id": 150, "bannerId": "A00010877", "firstName": "Donna", "lastName": "Bessette", "phone": "9102546", "email": "dbessette@yahoo.com", "birthDate": "06/02/1963" ],
        [ "id": 151, "bannerId": "A00010877", "firstName": "Donna", "lastName": "Bessette", "phone": "3234459", "email": "dbessette@yahoo.com", "birthDate": "06/02/1963" ],
        [ "id": 152, "bannerId": "A00010877", "firstName": "Donna", "lastName": "Bessette", "phone": "2556464", "email": "dbessette@yahoo.com", "birthDate": "06/02/1963" ],
        [ "id": 153, "bannerId": "A00012238", "firstName": "Ronald", "lastName": "Bessor", "phone": "7654322", "email": "larry@int.net                                    A", "birthDate": null ],
        [ "id": 154, "bannerId": "A00011237", "firstName": "Adam", "lastName": "Bevan", "phone": "8302388", "email": "adam.bevan@gmail.com", "birthDate": "06/25/1982" ],
        [ "id": 155, "bannerId": "A00010837", "firstName": "Haren", "lastName": "Bevermeyer", "phone": "4002002", "email": "ksheyer@ucdavis.edu", "birthDate": "07/08/1984" ],
        [ "id": 156, "bannerId": "HOF00742", "firstName": "Ray", "lastName": "Biltz", "phone": "3522644", "email": "Ray.Biltz@sungarduniv.edu", "birthDate": "03/08/1990" ],
        [ "id": 157, "bannerId": "HOF00742", "firstName": "Ray", "lastName": "Biltz", "phone": "8538513", "email": "Ray.Biltz@sungarduniv.edu", "birthDate": "03/08/1990" ],
        [ "id": 158, "bannerId": "A00010474", "firstName": "Cynthia", "lastName": "Black", "phone": "7874899", "email": "cbstudents@collegeboard.org", "birthDate": "05/28/1985" ],
        [ "id": 159, "bannerId": "HOF00720", "firstName": "Joanna", "lastName": "Blash", "phone": "2293395", "email": "Joanna.Blash@sungarduniv.edu", "birthDate": "12/14/1988" ],
        [ "id": 160, "bannerId": "HOF00720", "firstName": "Joanna", "lastName": "Blash", "phone": "2998962", "email": "Joanna.Blash@sungarduniv.edu", "birthDate": "12/14/1988" ],
        [ "id": 161, "bannerId": "SYS000008", "firstName": "Kathy", "lastName": "Blattner", "phone": "2221111", "email": "qw@qw.com", "birthDate": "06/27/1972" ],
        [ "id": 162, "bannerId": "SYS000008", "firstName": "Kathy", "lastName": "Blattner", "phone": "1111111", "email": "rkumar@aol.com", "birthDate": "06/27/1972" ],
        [ "id": 163, "bannerId": "SYS000008", "firstName": "Kathy", "lastName": "Blattner", "phone": "1111111", "email": "rkumar@aol.com", "birthDate": "06/27/1972" ],
        [ "id": 164, "bannerId": "SYS000008", "firstName": "Kathy", "lastName": "Blattner", "phone": "2221111", "email": "rkumar@aol.com", "birthDate": "06/27/1972" ],
        [ "id": 165, "bannerId": "SYS000008", "firstName": "Kathy", "lastName": "Blattner", "phone": "1111111", "email": "qw@qw.com", "birthDate": "06/27/1972" ],
        [ "id": 166, "bannerId": "SYS000008", "firstName": "Kathy", "lastName": "Blattner", "phone": "1111111", "email": "qw@qw.com", "birthDate": "06/27/1972" ],
        [ "id": 167, "bannerId": "HOSK00001", "firstName": "Dan", "lastName": "Blockar", "phone": "5555555", "email": "dblockar@camp.edu", "birthDate": "02/02/1991" ],
        [ "id": 168, "bannerId": "HOSR24782", "firstName": "Carol", "lastName": "Bonet", "phone": "2568971", "email": "clbonet@camp.edu", "birthDate": "12/12/1977" ],
        [ "id": 169, "bannerId": "A00012945", "firstName": "Jim", "lastName": "Bono", "phone": "787989879698", "email": "bono@aol.com", "birthDate": "01/01/1976" ],
        [ "id": 170, "bannerId": "A00011236", "firstName": "G", "lastName": "Bookatz", "phone": "3464500", "email": "gbbookatz@gmail.com", "birthDate": "10/01/1981" ],
        [ "id": 171, "bannerId": "610009618", "firstName": "Clark", "lastName": "Booker", "phone": "2938476", "email": "CBooker@home.com", "birthDate": "08/22/1977" ],
        [ "id": 172, "bannerId": "610009618", "firstName": "Clark", "lastName": "Booker", "phone": "2938476", "email": "CBooke@aol.com", "birthDate": "08/22/1977" ],
        [ "id": 173, "bannerId": "WTR00001", "firstName": "Ronald", "lastName": "Booth", "phone": "3339438", "email": "coffeetown@aol.com", "birthDate": "02/21/1983" ],
        [ "id": 174, "bannerId": "WTR00001", "firstName": "Ronald", "lastName": "Booth", "phone": "6652878", "email": "coffeetown@aol.com", "birthDate": "02/21/1983" ],
        [ "id": 175, "bannerId": "WTR00001", "firstName": "Ronald", "lastName": "Booth", "phone": "3301804", "email": "coffeetown@aol.com", "birthDate": "02/21/1983" ],
        [ "id": 176, "bannerId": "HOF00724", "firstName": "Alayna", "lastName": "Borror", "phone": "1163940", "email": "Alayna.Borror@sungarduniv.edu", "birthDate": "06/14/1990" ],
        [ "id": 177, "bannerId": "HOF00724", "firstName": "Alayna", "lastName": "Borror", "phone": "2422180", "email": "Alayna.Borror@sungarduniv.edu", "birthDate": "06/14/1990" ],
        [ "id": 178, "bannerId": "HOF00724", "firstName": "Alayna", "lastName": "Borror", "phone": "1281433", "email": "Alayna.Borror@sungarduniv.edu", "birthDate": "06/14/1990" ],
        [ "id": 179, "bannerId": "HOF00765", "firstName": "Dirk", "lastName": "Bradshaw", "phone": "6854553", "email": "Dirk.Bradshaw@sungarduniv.edu", "birthDate": "07/22/1990" ],
        [ "id": 180, "bannerId": "HOF00765", "firstName": "Dirk", "lastName": "Bradshaw", "phone": "1447753", "email": "Dirk.Bradshaw@sungarduniv.edu", "birthDate": "07/22/1990" ],
        [ "id": 181, "bannerId": "HOF00765", "firstName": "Dirk", "lastName": "Bradshaw", "phone": "5313720", "email": "Dirk.Bradshaw@sungarduniv.edu", "birthDate": "07/22/1990" ],
        [ "id": 182, "bannerId": "A00011179", "firstName": "Sarah", "lastName": "Branson", "phone": "9882421", "email": "sarahnangle@hotmail.com", "birthDate": "05/07/1975" ],
        [ "id": 183, "bannerId": "A00011179", "firstName": "Sarah", "lastName": "Branson", "phone": "9882421", "email": "sarahnangle@hotmail.com", "birthDate": "05/07/1975" ],
        [ "id": 184, "bannerId": "A00011179", "firstName": "Sarah", "lastName": "Branson", "phone": "9882421", "email": "sarahnangle@hotmail.com", "birthDate": "05/07/1975" ],
        [ "id": 185, "bannerId": "A00010905", "firstName": "Sarah", "lastName": "Bridges", "phone": "9280012", "email": "sbridges@sun.com", "birthDate": "05/01/1967" ],
        [ "id": 186, "bannerId": "A00011319", "firstName": "Beau", "lastName": "Brinckerhoff", "phone": "6143614", "email": "beau88@mac.com", "birthDate": "04/21/1983" ],
        [ "id": 187, "bannerId": "A00010475", "firstName": "Bryan", "lastName": "Brooks", "phone": "6445556", "email": "cbstudents@collegeboard.org", "birthDate": "03/05/1985" ],
        [ "id": 188, "bannerId": "A00011238", "firstName": "Adam", "lastName": "Brooks", "phone": "4573504", "email": "adam.guy@gmail.com", "birthDate": "11/26/1981" ],
        [ "id": 189, "bannerId": "A00010362", "firstName": "Ashley", "lastName": "Brown", "phone": "8744975", "email": "cbstudents@collegeboard.org", "birthDate": "02/07/1985" ],
        [ "id": 190, "bannerId": "465893499", "firstName": "Paula", "lastName": "Brownstone", "phone": "5546589", "email": "pbrownstone@aol.com", "birthDate": "09/10/1964" ],
        [ "id": 191, "bannerId": "465893499", "firstName": "Paula", "lastName": "Brownstone", "phone": "9586455", "email": "pbrownstone@aol.com", "birthDate": "09/10/1964" ],
        [ "id": 192, "bannerId": "465893499", "firstName": "Paula", "lastName": "Brownstone", "phone": "9745645", "email": "pbrownstone@aol.com", "birthDate": "09/10/1964" ],
        [ "id": 193, "bannerId": "A00010468", "firstName": "Taylor", "lastName": "Bryant", "phone": "5084792", "email": "cbstudents@collegeboard.org", "birthDate": "09/28/1987" ],
        [ "id": 194, "bannerId": "SYSTEST07", "firstName": "Cynthia", "lastName": "Bunte", "phone": "3632580", "email": "CYNDY@PERSONAL.COM", "birthDate": "08/11/1965" ],
        [ "id": 195, "bannerId": "SYSTEST07", "firstName": "Cynthia", "lastName": "Bunte", "phone": "4425243", "email": "CYNDY@PERSONAL.COM", "birthDate": "08/11/1965" ],
        [ "id": 196, "bannerId": "SYSTEST07", "firstName": "Cynthia", "lastName": "Bunte", "phone": "4425243", "email": "CYNDY@PERSONAL.COM", "birthDate": "08/11/1965" ],
        [ "id": 197, "bannerId": "SYSTEST07", "firstName": "Cynthia", "lastName": "Bunte", "phone": "4425243", "email": "CYNDY@PERSONAL.COM", "birthDate": "08/11/1965" ],
        [ "id": 198, "bannerId": "SYSTEST07", "firstName": "Cynthia", "lastName": "Bunte", "phone": "5555555", "email": "CYNDY@PERSONAL.COM", "birthDate": "08/11/1965" ],
        [ "id": 199, "bannerId": "SYSTEST07", "firstName": "Cynthia", "lastName": "Bunte", "phone": "4425243", "email": "CYNDY@PERSONAL.COM", "birthDate": "08/11/1965" ],
        [ "id": 200, "bannerId": "SYSTEST07", "firstName": "Cynthia", "lastName": "Bunte", "phone": "4425243", "email": "CYNDY@PERSONAL.COM", "birthDate": "08/11/1965" ]
    ]
}