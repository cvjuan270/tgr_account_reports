# -*- coding: utf-8 -*-
{
    'name': 'Reportes Contables Fisicos',
    'version': '16.0.1.0.0',
    'summary': """ 
        - Reporte de Formato 5.1
    """,
    'author': 'jcollado@tagre.pe',
    'website': 'tagre.pe',
    'category': 'localization',
    'depends': ['base', 'web', 'account'],
    "data": [
        "views/format_51_views.xml",
        "views/tgr_account_reports_menus.xml",
        "report/format_51_report.xml"
    ],'assets': {
            'web.assets_backend': [
                'tgr_account_reports/static/src/**/*'
            ],
        },
    'application': True,
    'installable': True,
    'auto_install': False,
    'license': 'LGPL-3',
}
