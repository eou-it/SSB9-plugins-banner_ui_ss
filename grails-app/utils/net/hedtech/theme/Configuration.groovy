package net.hedtech.theme

import javax.persistence.*
import java.sql.Clob

@Entity
@Table(name = "GUROCFG", schema = "baninst1")
class Configuration implements  Serializable{


    @Id
    @Column(name="GUROCFG_SURROGATE_ID")
    @SequenceGenerator(name = "GUROCFG_SEQ_GEN", sequenceName = "baninst1.GUROCFG_SURROGATE_ID_SEQ" ,
            allocationSize = 1, initialValue = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "GUROCFG_SEQ_GEN")
    //@GeneratedValue (strategy =GenerationType.AUTO)
    Long id;

    @Column(name="GUROCFG_Config_Value")
    @Lob
    Clob file;

    @Column(name="CONFIG_NAME")
    String configName;

    @Column(name="GUROCFG_CONFIG_ID")
    String configId

    @Column(name="GUROCFG_VERSION")
    Long version

    @Column(name="GUROCFG_USER_ID")
    String userId

    @Column(name="GUROCFG_DATA_ORIGIN")
    String dataOrigin

    @Column(name = "GUROCFG_ACTIVITY_DATE", columnDefinition="DATETIME")
    @Temporal(TemporalType.TIMESTAMP)
    Date activityDate;


    @Column(name="GUROCFG_VPDI_CODE")
    String vpdiCode

    @Column(name="GUROCFG_CONFIG_TYPE")
    String configType

    boolean equals(o) {
        if (this.is(o)) return true
        if (getClass() != o.class) return false

        Configuration that = (Configuration) o

        if (activityDate != that.activityDate) return false
        if (configId != that.configId) return false
        if (configName != that.configName) return false
        if (configType != that.configType) return false
        if (dataOrigin != that.dataOrigin) return false
        if (file != that.file) return false
        if (id != that.id) return false
        if (userId != that.userId) return false
        if (version != that.version) return false
        if (vpdiCode != that.vpdiCode) return false

        return true
    }

    int hashCode() {
        int result
        result = id.hashCode()
        result = 31 * result + (file != null ? file.hashCode() : 0)
        result = 31 * result + (configName != null ? configName.hashCode() : 0)
        result = 31 * result + (configId != null ? configId.hashCode() : 0)
        result = 31 * result + (version != null ? version.hashCode() : 0)
        result = 31 * result + (userId != null ? userId.hashCode() : 0)
        result = 31 * result + (dataOrigin != null ? dataOrigin.hashCode() : 0)
        result = 31 * result + activityDate.hashCode()
        result = 31 * result + (vpdiCode != null ? vpdiCode.hashCode() : 0)
        result = 31 * result + (configType != null ? configType.hashCode() : 0)
        return result
    }
    static constraints = {
        file(maxSize: 20 * 1024 * 1024) // 20 MBs

    }}
