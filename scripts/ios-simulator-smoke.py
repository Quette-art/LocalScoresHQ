"""Compile/launch smoke check helper for the macOS GitHub runner."""
import json
from pathlib import Path
import subprocess
import time


def run(*args):
    print("Running:", " ".join(args), flush=True)
    return subprocess.check_output(args, text=True, timeout=180).strip()


inventory = json.loads(run("xcrun", "simctl", "list", "--json"))
runtimes = sorted(
    (runtime for runtime in inventory["runtimes"]
     if runtime.get("isAvailable") and ".iOS-" in runtime["identifier"]),
    key=lambda runtime: tuple(int(part) for part in runtime["version"].split(".")),
    reverse=True,
)
phones = [
    device
    for runtime in runtimes
    for device in inventory["devices"].get(runtime["identifier"], [])
    if device.get("isAvailable") and device["name"].startswith("iPhone")
]
if not phones:
    raise RuntimeError("No available iPhone simulator on this runner")
phone = phones[0]
udid = phone["udid"]
print(f"Starting simulator: {phone["name"]}", flush=True)
run("open", "-a", "Simulator", "--args", "-CurrentDeviceUDID", udid)
if phone["state"] != "Booted":
    run("xcrun", "simctl", "boot", udid)
subprocess.run(["xcrun", "simctl", "bootstatus", udid, "-b"], check=True, timeout=300)
app_path = Path("build/DerivedData/Build/Products/Debug-iphonesimulator/App.app")
if not app_path.is_dir():
    raise RuntimeError(f"Compiled app missing: {app_path}")
run("xcrun", "simctl", "install", udid, str(app_path))
launch = run("xcrun", "simctl", "launch", udid, "com.localscoreshq.app")
# Let the web view render and connect to the existing Firebase project.
time.sleep(15)
reports = Path("build/reports")
reports.mkdir(parents=True, exist_ok=True)
run("xcrun", "simctl", "io", udid, "screenshot", str(reports / "iphone-home.png"))
(reports / "simulator.txt").write_text(
    f"Device: {phone['name']}\nUDID: {udid}\nLaunch: {launch}\n"
    "Screenshot captured after launch. App flows still need manual verification.\n"
)
print(f"Launched LocalScoresHQ on {phone['name']} and captured preview.")
