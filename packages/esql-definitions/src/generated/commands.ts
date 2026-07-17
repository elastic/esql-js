/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// DO NOT MODIFY THIS FILE BY HAND. IT IS GENERATED FROM `elasticsearch/` BY
// `yarn workspace @elastic/esql-definitions generate`.

import type { CommandDefinition } from '../definition_types';

export const commandDefinitions: CommandDefinition[] = [
  {
    name: 'change_point',
    license: 'PLATINUM',
    observabilityTier: 'COMPLETE',
  },
  {
    name: 'dedup',
  },
  {
    name: 'dissect',
  },
  {
    name: 'drop',
  },
  {
    name: 'enrich',
  },
  {
    name: 'eval',
  },
  {
    name: 'explain',
  },
  {
    name: 'fork',
  },
  {
    name: 'grok',
  },
  {
    name: 'highlight',
  },
  {
    name: 'inline_stats',
  },
  {
    name: 'insist',
  },
  {
    name: 'ip_location',
    output: {
      vary_by: 'database_file',
      selected_by: 'properties',
      variants: {
        '*-City.mmdb': {
          accuracy_radius: {
            type: 'integer',
            default: false,
          },
          city_name: {
            type: 'keyword',
          },
          continent_code: {
            type: 'keyword',
            default: false,
          },
          continent_name: {
            type: 'keyword',
          },
          country_in_european_union: {
            type: 'boolean',
            default: false,
          },
          country_iso_code: {
            type: 'keyword',
          },
          country_name: {
            type: 'keyword',
          },
          ip: {
            type: 'keyword',
            default: false,
          },
          location: {
            type: 'geo_point',
          },
          postal_code: {
            type: 'keyword',
            default: false,
          },
          region_iso_code: {
            type: 'keyword',
          },
          region_name: {
            type: 'keyword',
          },
          registered_country_in_european_union: {
            type: 'boolean',
            default: false,
          },
          registered_country_iso_code: {
            type: 'keyword',
            default: false,
          },
          registered_country_name: {
            type: 'keyword',
            default: false,
          },
          timezone: {
            type: 'keyword',
            default: false,
          },
        },
        '*-Country.mmdb': {
          continent_code: {
            type: 'keyword',
            default: false,
          },
          continent_name: {
            type: 'keyword',
          },
          country_in_european_union: {
            type: 'boolean',
            default: false,
          },
          country_iso_code: {
            type: 'keyword',
          },
          country_name: {
            type: 'keyword',
          },
          ip: {
            type: 'keyword',
            default: false,
          },
          registered_country_in_european_union: {
            type: 'boolean',
            default: false,
          },
          registered_country_iso_code: {
            type: 'keyword',
            default: false,
          },
          registered_country_name: {
            type: 'keyword',
            default: false,
          },
        },
        '*-ASN.mmdb': {
          asn: {
            type: 'long',
          },
          ip: {
            type: 'keyword',
          },
          network: {
            type: 'keyword',
          },
          organization_name: {
            type: 'keyword',
          },
        },
        '*-Anonymous-IP.mmdb': {
          anonymous: {
            type: 'boolean',
          },
          anonymous_vpn: {
            type: 'boolean',
          },
          hosting_provider: {
            type: 'boolean',
          },
          ip: {
            type: 'keyword',
            default: false,
          },
          public_proxy: {
            type: 'boolean',
          },
          residential_proxy: {
            type: 'boolean',
          },
          tor_exit_node: {
            type: 'boolean',
          },
        },
        '*-Connection-Type.mmdb': {
          connection_type: {
            type: 'keyword',
          },
          ip: {
            type: 'keyword',
            default: false,
          },
        },
        '*-Domain.mmdb': {
          domain: {
            type: 'keyword',
          },
          ip: {
            type: 'keyword',
            default: false,
          },
        },
        '*-Enterprise.mmdb': {
          accuracy_radius: {
            type: 'integer',
            default: false,
          },
          anonymous: {
            type: 'boolean',
            default: false,
          },
          anonymous_vpn: {
            type: 'boolean',
            default: false,
          },
          asn: {
            type: 'long',
            default: false,
          },
          city_confidence: {
            type: 'integer',
            default: false,
          },
          city_name: {
            type: 'keyword',
          },
          connection_type: {
            type: 'keyword',
            default: false,
          },
          continent_code: {
            type: 'keyword',
            default: false,
          },
          continent_name: {
            type: 'keyword',
          },
          country_confidence: {
            type: 'integer',
            default: false,
          },
          country_in_european_union: {
            type: 'boolean',
            default: false,
          },
          country_iso_code: {
            type: 'keyword',
          },
          country_name: {
            type: 'keyword',
          },
          domain: {
            type: 'keyword',
            default: false,
          },
          hosting_provider: {
            type: 'boolean',
            default: false,
          },
          ip: {
            type: 'keyword',
            default: false,
          },
          isp: {
            type: 'keyword',
            default: false,
          },
          isp_organization_name: {
            type: 'keyword',
            default: false,
          },
          location: {
            type: 'geo_point',
          },
          mobile_country_code: {
            type: 'keyword',
            default: false,
          },
          mobile_network_code: {
            type: 'keyword',
            default: false,
          },
          network: {
            type: 'keyword',
            default: false,
          },
          organization_name: {
            type: 'keyword',
            default: false,
          },
          postal_code: {
            type: 'keyword',
            default: false,
          },
          postal_confidence: {
            type: 'integer',
            default: false,
          },
          public_proxy: {
            type: 'boolean',
            default: false,
          },
          region_iso_code: {
            type: 'keyword',
          },
          region_name: {
            type: 'keyword',
          },
          registered_country_in_european_union: {
            type: 'boolean',
            default: false,
          },
          registered_country_iso_code: {
            type: 'keyword',
            default: false,
          },
          registered_country_name: {
            type: 'keyword',
            default: false,
          },
          residential_proxy: {
            type: 'boolean',
            default: false,
          },
          timezone: {
            type: 'keyword',
            default: false,
          },
          tor_exit_node: {
            type: 'boolean',
            default: false,
          },
          user_type: {
            type: 'keyword',
            default: false,
          },
        },
        '*-ISP.mmdb': {
          asn: {
            type: 'long',
          },
          ip: {
            type: 'keyword',
          },
          isp: {
            type: 'keyword',
          },
          isp_organization_name: {
            type: 'keyword',
          },
          mobile_country_code: {
            type: 'keyword',
          },
          mobile_network_code: {
            type: 'keyword',
          },
          network: {
            type: 'keyword',
          },
          organization_name: {
            type: 'keyword',
          },
        },
        'ipinfo*plus*.mmdb': {
          accuracy_radius: {
            type: 'integer',
            default: false,
          },
          anonymous: {
            type: 'boolean',
            default: false,
          },
          anycast: {
            type: 'boolean',
            default: false,
          },
          asn: {
            type: 'long',
            default: false,
          },
          asn_changed_date: {
            type: 'keyword',
            default: false,
          },
          city_name: {
            type: 'keyword',
          },
          continent_code: {
            type: 'keyword',
            default: false,
          },
          continent_name: {
            type: 'keyword',
          },
          country_iso_code: {
            type: 'keyword',
          },
          country_name: {
            type: 'keyword',
          },
          dma_code: {
            type: 'keyword',
            default: false,
          },
          domain: {
            type: 'keyword',
            default: false,
          },
          geo_changed_date: {
            type: 'keyword',
            default: false,
          },
          geoname_id: {
            type: 'keyword',
            default: false,
          },
          hosting: {
            type: 'boolean',
            default: false,
          },
          ip: {
            type: 'keyword',
            default: false,
          },
          isp: {
            type: 'keyword',
            default: false,
          },
          location: {
            type: 'geo_point',
          },
          mobile: {
            type: 'boolean',
            default: false,
          },
          mobile_country_code: {
            type: 'keyword',
            default: false,
          },
          mobile_network_code: {
            type: 'keyword',
            default: false,
          },
          network: {
            type: 'keyword',
            default: false,
          },
          organization_name: {
            type: 'keyword',
            default: false,
          },
          postal_code: {
            type: 'keyword',
            default: false,
          },
          proxy: {
            type: 'boolean',
            default: false,
          },
          region_iso_code: {
            type: 'keyword',
          },
          region_name: {
            type: 'keyword',
          },
          relay: {
            type: 'boolean',
            default: false,
          },
          satellite: {
            type: 'boolean',
            default: false,
          },
          service: {
            type: 'keyword',
            default: false,
          },
          timezone: {
            type: 'keyword',
            default: false,
          },
          tor: {
            type: 'boolean',
            default: false,
          },
          type: {
            type: 'keyword',
            default: false,
          },
          vpn: {
            type: 'boolean',
            default: false,
          },
        },
        'ipinfo*asn*.mmdb': {
          asn: {
            type: 'long',
          },
          country_iso_code: {
            type: 'keyword',
            default: false,
          },
          domain: {
            type: 'keyword',
            default: false,
          },
          ip: {
            type: 'keyword',
          },
          network: {
            type: 'keyword',
          },
          organization_name: {
            type: 'keyword',
          },
          type: {
            type: 'keyword',
            default: false,
          },
        },
        'ipinfo*country*.mmdb': {
          continent_code: {
            type: 'keyword',
            default: false,
          },
          continent_name: {
            type: 'keyword',
          },
          country_iso_code: {
            type: 'keyword',
          },
          country_name: {
            type: 'keyword',
          },
          ip: {
            type: 'keyword',
            default: false,
          },
        },
        'ipinfo*location*.mmdb': {
          city_name: {
            type: 'keyword',
          },
          country_iso_code: {
            type: 'keyword',
          },
          ip: {
            type: 'keyword',
            default: false,
          },
          location: {
            type: 'geo_point',
          },
          postal_code: {
            type: 'keyword',
            default: false,
          },
          region_name: {
            type: 'keyword',
          },
          timezone: {
            type: 'keyword',
            default: false,
          },
        },
        'ipinfo*privacy*.mmdb': {
          hosting: {
            type: 'boolean',
          },
          ip: {
            type: 'keyword',
            default: false,
          },
          proxy: {
            type: 'boolean',
          },
          relay: {
            type: 'boolean',
          },
          service: {
            type: 'keyword',
          },
          tor: {
            type: 'boolean',
          },
          vpn: {
            type: 'boolean',
          },
        },
      },
    },
  },
  {
    name: 'keep',
  },
  {
    name: 'limit',
  },
  {
    name: 'lookup',
  },
  {
    name: 'lookup_join',
  },
  {
    name: 'metrics_info',
  },
  {
    name: 'mmr',
  },
  {
    name: 'mv_expand',
  },
  {
    name: 'registered_domain',
    output: {
      vary_by: 'none',
      variants: {
        all: {
          domain: {
            type: 'keyword',
          },
          registered_domain: {
            type: 'keyword',
          },
          subdomain: {
            type: 'keyword',
          },
          top_level_domain: {
            type: 'keyword',
          },
        },
      },
    },
  },
  {
    name: 'rename',
  },
  {
    name: 'rerank',
  },
  {
    name: 'sample',
  },
  {
    name: 'sort',
  },
  {
    name: 'stats',
  },
  {
    name: 'ts_info',
  },
  {
    name: 'uri_parts',
    output: {
      vary_by: 'none',
      variants: {
        all: {
          domain: {
            type: 'keyword',
          },
          extension: {
            type: 'keyword',
          },
          fragment: {
            type: 'keyword',
          },
          password: {
            type: 'keyword',
          },
          path: {
            type: 'keyword',
          },
          port: {
            type: 'integer',
          },
          query: {
            type: 'keyword',
          },
          scheme: {
            type: 'keyword',
          },
          user_info: {
            type: 'keyword',
          },
          username: {
            type: 'keyword',
          },
        },
      },
    },
  },
  {
    name: 'user_agent',
    output: {
      vary_by: 'none',
      variants: {
        all: {
          'device.name': {
            type: 'keyword',
          },
          'device.type': {
            type: 'keyword',
          },
          name: {
            type: 'keyword',
          },
          'os.full': {
            type: 'keyword',
          },
          'os.name': {
            type: 'keyword',
          },
          'os.version': {
            type: 'keyword',
          },
          version: {
            type: 'keyword',
          },
        },
      },
    },
  },
  {
    name: 'where',
  },
];
