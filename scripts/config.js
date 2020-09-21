/*
 *
 * Mirai Console Loader
 *
 * Copyright (C) 2020 iTX Technologies
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @author PeratX
 * @website https://github.com/iTXTech/mirai-console-loader
 *
 */

importPackage(org.apache.commons.cli);
importPackage(java.net);
importPackage(java.lang);
importPackage(org.itxtech.mcl.component);

loader.options.addOption(Option.builder("p").desc("Specify HTTP proxy for current instance")
    .longOpt("proxy").hasArg().argName("address").build());
loader.options.addOption(Option.builder("c").desc("Set log level")
    .longOpt("log-level").hasArg().argName("level").build());
loader.options.addOption(Option.builder("s").desc("List configured packages")
    .longOpt("list-packages").build());
loader.options.addOption(Option.builder("r").desc("Remove package")
    .longOpt("remove-package").hasArg().argName("PackageName").build());
loader.options.addOption(Option.builder("a").desc("Add package")
    .longOpt("add-package").hasArg().argName("PackageName").build());
loader.options.addOption(Option.builder("n").desc("Set update channel of specified package")
    .longOpt("set-channel").hasArg().argName("Channel").build());

phase.cli = () => {
    if (loader.cli.hasOption("p")) {
        let addr = loader.cli.getOptionValue("p").split(":");
        loader.proxy = new InetSocketAddress(addr[0], Integer.parseInt(addr[1]));
    }
    if (loader.cli.hasOption("c")) {
        let lvl = Integer.parseInt(loader.cli.getOptionValue("c"));
        logger.setLogLevel(lvl);
    }
    if (loader.cli.hasOption("s")) {
        let pkgs = loader.config.packages;
        for (let i in pkgs) {
            let pkg = pkgs[i];
            logger.info("Package: " + pkg.name + "  Channel: " + pkg.channel + "  Version: " + pkg.version);
        }
        System.exit(0);
    }
    if (loader.cli.hasOption("r")) {
        let name = loader.cli.getOptionValue("r");
        let pkgs = loader.config.packages;
        for (let i in pkgs) {
            let pkg = pkgs[i];
            if (pkg.name.equals(name)) {
                pkgs.remove(pkg);
                logger.info("Package \"" + pkg.name + "\" has been removed.");
                loader.config.save();
                System.exit(0);
            }
        }
        logger.error("Package \"" + name + "\" not found.");
        System.exit(1);
    }
    if (loader.cli.hasOption("a")) {
        let channel = "stable";
        if (loader.cli.hasOption("n")) {
            channel = loader.cli.getOptionValue("n");
        }
        let name = loader.cli.getOptionValue("a");
        let pkgs = loader.config.packages;
        for (let i in pkgs) {
            let pkg = pkgs[i];
            if (pkg.name.equals(name)) {
                pkg.channel = channel;
                logger.info("Package \"" + pkg.name + "\" has been updated.");
                loader.config.save();
                System.exit(0);
            }
        }
        let pkg = new Config.Package(name, channel);
        pkgs.add(pkg);
        logger.info("Package \"" + pkg.name + "\" has been added.");
        loader.config.save();
        System.exit(0);
    }
}
