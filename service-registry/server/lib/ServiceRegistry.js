const semver = require('semver');

class ServiceRegistry {
  constructor(log) {
    this.log = log;
    this.services = {};
    this.timeout = 10;
  }

  get(name, version) {
    this.cleanUp();
    const candidates = Object.values(this.services);
    const con = candidates.filter((service) => {
      return (
        service.name === name && semver.satisfies(service.version, version)
      );
    });
    return candidates[Math.floor(Math.random() * con.length)];
  }

  register(name, version, ip, port) {
    this.cleanUp();
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

  cleanUp() {
    const now = Math.floor(new Date() / 1000);
    Object.keys(this.services).forEach((key) => {
      if (this.services[key].timestamp + this.timeout < now) {
        delete this.services[key];
        this.log.debug(`Removed service ${key}`);
      }
    });
  }
}

module.exports = ServiceRegistry;
