package net.hedtech.dbservice

import grails.transaction.Transactional


class BaseDbService<T>{
    def sessionFactory

    private final Class<T> clazz

    BaseDbService() {}

    BaseDbService(Class clazz) {
        this.clazz = clazz
    }

    public void save(Collection<T> entities) {

       for (T t: entities) {
            sessionFactory.getCurrentSession().save(t);
        }
    }

    def update(Collection<T> entities){
        for (T t: entities) {
            sessionFactory.getCurrentSession().update(t);
        }
    }

    def saveorupdate(Collection<T> entities){
        for (T t: entities) {
            sessionFactory.getCurrentSession().saveOrUpdate(t);
        }
    }

    def delete(Object obj){
        for (T t: entities) {
            sessionFactory.getCurrentSession().delete(t);
        }
    }
}
