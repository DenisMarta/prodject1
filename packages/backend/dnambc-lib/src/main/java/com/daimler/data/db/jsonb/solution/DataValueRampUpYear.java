package com.daimler.data.db.jsonb.solution;

import java.io.Serializable;
import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class DataValueRampUpYear implements Serializable {

	private static final long serialVersionUID = 1L;

	private BigDecimal year;
	private BigDecimal value;

}