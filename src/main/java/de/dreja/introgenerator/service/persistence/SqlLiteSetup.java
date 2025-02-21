package de.dreja.introgenerator.service.persistence;

import liquibase.integration.spring.SpringLiquibase;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
@SuppressWarnings("unused")
public class SqlLiteSetup {

    @Bean
    SpringLiquibase liquibase(DataSource dataSource) {
        final SpringLiquibase lb = new SpringLiquibase();
        lb.setChangeLog("classpath:db/changelog/master.yml");
        lb.setDataSource(dataSource);
        return lb;
    }
}
