package net.hedtech.banner.general

import javax.persistence.*

@Entity
@Table(name = "GUROCFG")
class Configuration implements  Serializable{

    @Id
    @Column(name="GUROCFG_SURROGATE_ID")
    @SequenceGenerator(name = "GUROCFG_SEQ_GEN", sequenceName = "GUROCFG_SURROGATE_ID_SEQ", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "GUROCFG_SEQ_GEN")
    Long id;

    @Column(name="CONFIG_NAME", nullable = false, length = 50)
    String configName;

    @Column(name="GUROCFG_CONFIG_TYPE", nullable = false, length = 30)
    String configType

    @Column(name="GUROCFG_CONFIG_VALUE", nullable = true)
    @Lob
    String file;

    @Version
    @Column(name="GUROCFG_VERSION" , nullable = false, precision = 19)
    Long version

    @Column(name="GUROCFG_USER_ID", length = 30)
    String lastModifiedBy

    @Column(name="GUROCFG_DATA_ORIGIN", length = 30)
    String dataOrigin

    @Column(name = "GUROCFG_ACTIVITY_DATE" )
    @Temporal(TemporalType.TIMESTAMP)
    Date lastModified

    boolean equals(o) {
        if (this.is(o)) return true
        if (getClass() != o.class) return false

        Configuration that = (Configuration) o

        if (lastModified != that.lastModified) return false
        if (configName != that.configName) return false
        if (configType != that.configType) return false
        if (dataOrigin != that.dataOrigin) return false
        //if (file != that.file) return false
        if (id != that.id) return false
        if (lastModifiedBy != that.lastModifiedBy) return false
        if (version != that.version) return false

        return true
    }

    int hashCode() {
        int result
        result = (id!=null ? id.hashCode():1)
        //result = 31 * result + (file != null ? file.hashCode() : 0)
        result = 31 * result + (configName != null ? configName.hashCode() : 0)
        result = 31 * result + (version != null ? version.hashCode() : 0)
        result = 31 * result + (lastModifiedBy != null ? lastModifiedBy.hashCode() : 0)
        result = 31 * result + (dataOrigin != null ? dataOrigin.hashCode() : 0)
        result = 31 * result + lastModified.hashCode()
        result = 31 * result + (configType != null ? configType.hashCode() : 0)
        return result
    }

    @Override
    public String toString() {
        return "Configuration{" +
                "id=" + id +
                //", file=" + file +
                ", configName='" + configName + '\'' +
                ", version=" + version +
                ", lastModifiedBy='" + lastModifiedBy + '\'' +
                ", dataOrigin='" + dataOrigin + '\'' +
                ", lastModified=" + lastModified +
                ", configType='" + configType + '\'' +
                '}';
    }

//Remove for now
//    static constraints = {
//        dataOrigin(nullable: true)
//        configType(nullable: false)
//        configName(nullable: false)
//        file(nullable: true)
//        lastModifiedBy(nullable: true)
//        lastModified(nullable: false)
//    }
}
