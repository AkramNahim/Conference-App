const semver = require('semver');

class ServiceRegistry {
  constructor(log) {
    this.log = log;
    this.services = {};
    this.timeout = 30;
  }

  get(name, version) {
    const candidates = Object.values(this.services);
    const con = candidates.filter((service) => {
      return (
        service.name === name && semver.satisfies(service.version, version)
      );
    });
    return candidates[Math.floor(Math.random() * con.length)];
  }

  register(name, version, ip, port) {
    const key = name + version + ip + port;
    if (!this.services[key]) {
      this.services[key] = {};
      this.services[key].timestamp = Math.floor(new Date() / 1000);
      this.services[key].name = name;
      this.services[key].ip = ip;
      this.services[key].version = version;
      this.services[key].port = port;
      this.log.debug(
        `Added service ${name} of version ${version}, at ${ip}:${port}`
      );
      return key;
    }
    this.services[key].timestamp = Math.floor(new Date() / 1000);
    this.log.debug(
      `Updated service ${name} of version ${version}, at ${ip}:${port}`
    );
    return key;
  }

  unregister(name, version, ip, port) {
    const key = name + version + ip + port;
    delete this.services[key];
    return key;
  }
}

module.exports = ServiceRegistry;
