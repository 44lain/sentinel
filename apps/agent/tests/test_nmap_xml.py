SAMPLE_HOST_XML = """<?xml version="1.0"?>
<nmaprun>
<host>
  <status state="up"/>
  <address addr="10.0.0.1" addrtype="ipv4"/>
  <address addr="AA:BB:CC:DD:EE:FF" addrtype="mac" vendor="Intelbras"/>
  <hostnames>
    <hostname name="router.local" type="PTR"/>
  </hostnames>
  <ports>
    <port protocol="tcp" portid="443">
      <state state="open" reason="syn-ack"/>
      <service name="https" product="nginx" version="1.24.0" extrainfo="Ubuntu" conf="10"/>
      <script id="http-title" output="NetAtlas"/>
    </port>
    <port protocol="tcp" portid="5432">
      <state state="open"/>
      <service name="postgresql" product="PostgreSQL" version="16.2"/>
    </port>
    <port protocol="tcp" portid="9999">
      <state state="closed"/>
    </port>
  </ports>
  <os>
    <osmatch name="Linux 5.4" accuracy="96">
      <osclass type="general purpose" vendor="Linux" osfamily="Linux" osgen="5.X"/>
    </osmatch>
  </os>
</host>
</nmaprun>
"""


def test_parse_host_scan_xml_full() -> None:
    from netatlas.nmap_xml import parse_host_scan_xml

    result = parse_host_scan_xml(SAMPLE_HOST_XML, "10.0.0.1")
    assert result.hostname == "router.local"
    assert result.mac_address == "AA:BB:CC:DD:EE:FF"
    assert result.vendor == "Intelbras"
    assert result.os_name == "Linux 5.4"
    assert result.os_accuracy == 96
    assert result.os_family == "Linux"
    assert len(result.ports) == 2
    assert result.ports[0].port_number == 443
    assert result.ports[0].service_product == "nginx"
    assert result.ports[0].service_version == "1.24.0"
    assert result.ports[0].service_extra is not None
    assert "http-title" in result.ports[0].service_extra
    assert result.ports[1].port_number == 5432
    assert result.ports[1].service_name == "postgresql"


def test_parse_host_scan_xml_missing_host() -> None:
    from netatlas.nmap_xml import parse_host_scan_xml

    result = parse_host_scan_xml(SAMPLE_HOST_XML, "10.0.0.99")
    assert result.ports == []
    assert result.os_name is None
