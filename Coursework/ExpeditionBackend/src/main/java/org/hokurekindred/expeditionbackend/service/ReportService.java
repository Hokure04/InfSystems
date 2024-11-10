package org.hokurekindred.expeditionbackend.service;

import org.hokurekindred.expeditionbackend.model.Report;
import org.hokurekindred.expeditionbackend.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ReportService {
    @Autowired
    private ReportRepository reportRepository;

    public ResponseEntity<Map<String, Object>> getAllReports() {
        Map<String, Object> response = new HashMap<>();
        response.put("report_list", reportRepository.findAll());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
