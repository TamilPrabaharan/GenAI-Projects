def calculate_tax(gross_salary):
    """Calculates tax based on 2025 budget rules with marginal relief (Section 87A)."""

    standard_deduction = 75000
    net_income = gross_salary - standard_deduction

    if gross_salary <= 1275000:
        return f"""
Gross Salary: ₹{gross_salary}

Standard Deduction: ₹{standard_deduction}

Net Taxable Income: ₹{net_income}

Final Tax Payable: ₹0
"""

    tax_slabs = [
        (400000, 0.0),
        (400000, 0.05),
        (400000, 0.10),
        (400000, 0.15),
        (400000, 0.20),
        (400000, 0.25),
        (float('inf'), 0.30),
    ]

    tax_computed = 0
    tax_details = []
    lower_limit = 0

    for slab, rate in tax_slabs:
        if net_income > lower_limit:  # Use net_income here
            taxable = min(net_income, lower_limit + slab) - lower_limit
            tax = taxable * rate
            tax_details.append(
                f"{int(rate * 100)}% on ₹{lower_limit + 1} to ₹{min(net_income, lower_limit + slab)}: ₹{int(tax)}"
            )
            tax_computed += tax
        lower_limit += slab # This was missing, hence causing issues.

    marginal_relief_cap = max(0, net_income - 1200000)
    final_tax = min(tax_computed, marginal_relief_cap)

    if tax_computed > marginal_relief_cap:
        tax_breakdown = f"""
Gross Salary: ₹{gross_salary}

Standard Deduction: ₹{standard_deduction}

Net Taxable Income: ₹{net_income}

Tax Computation by Slabs:
{chr(10).join(tax_details)}

Tax computed by slabs: ₹{int(tax_computed)}

Excess over threshold (Marginal Relief Cap): ₹{int(marginal_relief_cap)} (i.e., ₹{net_income} - ₹1200000)

Final Tax Payable: ₹{int(final_tax)}

Note: The tax computed as per slabs is ₹{int(tax_computed)}, 
but since the difference between ₹{net_income} and ₹1200000 is only ₹{int(marginal_relief_cap)},
the final tax payable is ₹{int(final_tax)}.
"""
    else:
        tax_breakdown = f"""
Gross Salary: ₹{gross_salary}

Standard Deduction: ₹{standard_deduction}

Net Taxable Income: ₹{net_income}

Tax Computation by Slabs:
{chr(10).join(tax_details)}

Tax computed by slabs: ₹{int(tax_computed)}

Final Tax Payable: ₹{int(final_tax)}
"""

    return tax_breakdown