export const en = {
  "common.cancel": "Cancel",
  "common.camera": "Camera",
  "common.gallery": "Gallery",
  "common.loading": "Loading...",
  "common.photoLimit": "You can add up to {max} photos per report.",

  "tabs.home": "Home",
  "tabs.map": "Map",
  "tabs.report": "Report",
  "tabs.profile": "Profile",

  "report.header.badge": "Community Report",
  "report.header.title": "Report Incident",
  "report.header.subtitle":
    "Start from your current location, adjust the incident pin if needed, then SIGAP checks for similar active incidents nearby.",
  "report.submit.idle": "Submit Report",
  "report.submit.loading": "Sending...",

  "report.location.title": "Incident location",
  "report.location.description":
    "SIGAP starts with your current location. If the incident happened somewhere else nearby, adjust the pin before submitting.",
  "report.location.currentPin": "Using your current location as the incident pin.",
  "report.location.manualPin": "Using an adjusted incident pin.",
  "report.location.notSet": "No pin selected yet. SIGAP will use your current location when you submit.",
  "report.location.accuracy": "GPS accuracy around {accuracy} m",
  "report.location.useCurrent": "Use Current Location",
  "report.location.adjustPin": "Adjust Pin",
  "report.location.picker.title": "Adjust Incident Pin",
  "report.location.picker.subtitle": "Tap the map or drag the marker to where the incident happened.",
  "report.location.picker.save": "Save Pin",

  "report.category.title": "1. Category",
  "report.category.subtitle": "Choose the main type of incident.",
  "report.subcategory.title": "2. Subcategory",
  "report.subcategory.subtitle":
    "Choose a more specific incident type when useful.",
  "report.kind.title": "1. What happened?",
  "report.kind.subtitle":
    "Pick the closest match. SIGAP uses this to route, filter, and de-duplicate reports.",
  "report.impact.title": "2. Current impact",
  "report.impact.subtitle":
    "Tap what is true right now. These answers calculate urgency automatically.",
  "report.details.title": "3. Add context",
  "report.details.subtitle":
    "Optional, but useful if there is something nearby people should know.",
  "report.details.titlePlaceholder": "Optional headline",
  "report.details.descriptionPlaceholder":
    "Add a short note, landmarks, affected direction, or anything important.",
  "report.details.minimumCharacters": "{count}/{min} minimum characters",
  "report.severity.title": "4. Severity",
  "report.severity.subtitle": "Choose how urgent the current situation is.",
  "report.evidence.title": "4. Evidence",
  "report.evidence.subtitle":
    "Add 1-4 incident photos. The first photo becomes the report cover.",
  "report.evidence.counter": "{count}/{max} photos selected",
  "report.evidence.cover": "Cover",
  "report.evidence.emptyTitle": "No photos yet",
  "report.evidence.emptyText":
    "At least 1 photo is required before the report can become a public map pin.",

  "report.validation.loginRequired.title": "Login Required",
  "report.validation.loginRequired.message":
    "Please log in before sending a report.",
  "report.validation.categoryRequired.title": "Category Required",
  "report.validation.categoryRequired.message":
    "Choose the incident category first.",
  "report.validation.kindRequired.title": "Report Type Required",
  "report.validation.kindRequired.message":
    "Choose what happened before submitting.",
  "report.validation.subcategoryRequired.title": "Incident Type Required",
  "report.validation.subcategoryRequired.message":
    "Choose the specific incident type before submitting.",
  "report.validation.titleTooShort.title": "Title Too Short",
  "report.validation.titleTooShort.message":
    "The title must be at least {min} characters.",
  "report.validation.descriptionTooShort.title": "Description Too Short",
  "report.validation.descriptionTooShort.message":
    "The description must be at least {min} characters.",
  "report.validation.photoRequired.title": "Photo Required",
  "report.validation.photoRequired.message": "Add at least 1 incident photo.",
  "report.validation.photoLimit.title": "Photo Limit",
  "report.validation.cameraPermission.title": "Camera Permission Needed",
  "report.validation.cameraPermission.message":
    "Enable camera permission to take evidence photos.",
  "report.validation.galleryPermission.title": "Gallery Permission Needed",
  "report.validation.galleryPermission.message":
    "Enable gallery permission to choose evidence photos.",
  "report.validation.invalidPhoto.title": "Invalid Photo",
  "report.validation.invalidCapturedPhoto.message":
    "Could not read the captured photo.",
  "report.validation.invalidSelectedPhoto.message":
    "Could not read the selected image.",
  "report.validation.locationPermission.title": "Location Permission Needed",
  "report.validation.locationPermission.message":
    "Enable location permission so this report can be placed on the map.",
  "report.validation.lowAccuracy.title": "Low Location Accuracy",
  "report.validation.lowAccuracy.message":
    "Your location accuracy is about {accuracy} meters. Turn on high accuracy/GPS and try again.",
  "report.validation.uploadFailed.title": "Upload Failed",
  "report.validation.uploadFailed.message":
    "At least 1 evidence photo must upload successfully.",

  "report.error.openCamera.title": "Could Not Open Camera",
  "report.error.openCamera.fallback":
    "Something went wrong while opening the camera.",
  "report.error.openGallery.title": "Could Not Open Gallery",
  "report.error.openGallery.fallback":
    "Something went wrong while opening the gallery.",
  "report.error.send.title": "Could Not Send Report",
  "report.error.send.fallback": "Something went wrong while sending the report.",

  "report.duplicate.title": "Similar Incident Nearby",
  "report.duplicate.message":
    "\"{title}\" is about {distance} away. Updating the existing incident usually keeps the map cleaner.",
  "report.duplicate.reviewMap": "Review Map",
  "report.duplicate.submitNew": "Submit New",

  "report.success.title": "Report Sent",
  "report.success.message": "Your report has been added to the map.",
  "report.success.viewMap": "View Map",
  "report.success.createAnother": "Create Another",

  "incident.category.natural_disaster.label": "Natural Disaster",
  "incident.category.natural_disaster.short": "Disaster",
  "incident.category.natural_disaster.description":
    "Floods, earthquakes, landslides, tsunamis, strong winds, or other natural hazards.",
  "incident.category.fire_emergency.label": "Fire Emergency",
  "incident.category.fire_emergency.short": "Fire",
  "incident.category.fire_emergency.description":
    "Fire, heavy smoke, building fires, vehicle fires, land fires, or electrical fires.",
  "incident.category.accident_infrastructure.label":
    "Accident & Infrastructure",
  "incident.category.accident_infrastructure.short": "Road",
  "incident.category.accident_infrastructure.description":
    "Accidents, blocked or damaged roads, fallen trees, downed cables, or damaged facilities.",
  "incident.category.security_public_order.label": "Security & Public Order",
  "incident.category.security_public_order.short": "Security",
  "incident.category.security_public_order.description":
    "Crime, theft, fights, risky crowds, public disturbance, or safety concerns.",
  "incident.category.medical_rescue.label": "Medical & Rescue",
  "incident.category.medical_rescue.short": "Medical",
  "incident.category.medical_rescue.description":
    "Medical emergencies, fainting, workplace accidents, drowning, or evacuation needs.",
  "incident.category.missing_lost.label": "Missing / Lost",
  "incident.category.missing_lost.short": "Missing",
  "incident.category.missing_lost.description":
    "Missing people, lost items, or missing vehicles.",
  "incident.category.other.label": "Other / Not Sure",
  "incident.category.other.short": "Other",
  "incident.category.other.description":
    "Reports that do not fit the main incident types yet.",

  "incident.subcategory.flood.label": "Flood",
  "incident.subcategory.flood.short": "Flood",
  "incident.subcategory.earthquake.label": "Earthquake",
  "incident.subcategory.earthquake.short": "Quake",
  "incident.subcategory.landslide.label": "Landslide",
  "incident.subcategory.landslide.short": "Slide",
  "incident.subcategory.volcanic_eruption.label": "Volcanic Eruption",
  "incident.subcategory.volcanic_eruption.short": "Volcano",
  "incident.subcategory.strong_wind.label": "Strong Wind",
  "incident.subcategory.strong_wind.short": "Wind",
  "incident.subcategory.tsunami.label": "Tsunami",
  "incident.subcategory.tsunami.short": "Tsunami",
  "incident.subcategory.fire.label": "General Fire",
  "incident.subcategory.fire.short": "Fire",
  "incident.subcategory.building_fire.label": "House / Building Fire",
  "incident.subcategory.building_fire.short": "Building",
  "incident.subcategory.vehicle_fire.label": "Vehicle Fire",
  "incident.subcategory.vehicle_fire.short": "Vehicle",
  "incident.subcategory.land_fire.label": "Land Fire",
  "incident.subcategory.land_fire.short": "Land",
  "incident.subcategory.electrical_fire.label": "Electrical Fire",
  "incident.subcategory.electrical_fire.short": "Electric",
  "incident.subcategory.traffic_accident.label": "Traffic Accident",
  "incident.subcategory.traffic_accident.short": "Accident",
  "incident.subcategory.fallen_tree.label": "Fallen Tree",
  "incident.subcategory.fallen_tree.short": "Tree",
  "incident.subcategory.road_block.label": "Road Block",
  "incident.subcategory.road_block.short": "Blocked",
  "incident.subcategory.damaged_road.label": "Damaged Road",
  "incident.subcategory.damaged_road.short": "Road",
  "incident.subcategory.fallen_power_line.label": "Downed Power Line",
  "incident.subcategory.fallen_power_line.short": "Cable",
  "incident.subcategory.collapsed_building.label": "Collapsed Building",
  "incident.subcategory.collapsed_building.short": "Collapse",
  "incident.subcategory.crime.label": "Crime",
  "incident.subcategory.crime.short": "Crime",
  "incident.subcategory.theft.label": "Theft",
  "incident.subcategory.theft.short": "Theft",
  "incident.subcategory.brawl.label": "Fight / Brawl",
  "incident.subcategory.brawl.short": "Brawl",
  "incident.subcategory.risky_crowd.label": "Risky Crowd",
  "incident.subcategory.risky_crowd.short": "Crowd",
  "incident.subcategory.mob_violence.label": "Mob Violence",
  "incident.subcategory.mob_violence.short": "Mob",
  "incident.subcategory.public_disturbance.label": "Public Disturbance",
  "incident.subcategory.public_disturbance.short": "Disturb",
  "incident.subcategory.medical.label": "Medical Emergency",
  "incident.subcategory.medical.short": "Medical",
  "incident.subcategory.fainted_person.label": "Fainted Person",
  "incident.subcategory.fainted_person.short": "Faint",
  "incident.subcategory.work_accident.label": "Workplace Accident",
  "incident.subcategory.work_accident.short": "Work",
  "incident.subcategory.drowning.label": "Drowning",
  "incident.subcategory.drowning.short": "Drown",
  "incident.subcategory.evacuation_needed.label": "Evacuation Needed",
  "incident.subcategory.evacuation_needed.short": "Evacuate",
  "incident.subcategory.missing_person.label": "Missing Person",
  "incident.subcategory.missing_person.short": "Missing",
  "incident.subcategory.missing_item.label": "Lost Item",
  "incident.subcategory.missing_item.short": "Item",
  "incident.subcategory.missing_vehicle.label": "Missing Vehicle",
  "incident.subcategory.missing_vehicle.short": "Vehicle",
  "incident.subcategory.other_incident.label": "Other Incident",
  "incident.subcategory.other_incident.short": "Other",

  "report.kind.roadBlockedOrCrash.label": "Road blocked / crash",
  "report.kind.roadBlockedOrCrash.short": "Road",
  "report.kind.roadBlockedOrCrash.helper":
    "Accident, fallen tree, damaged road, blocked access, or traffic hazard.",
  "report.kind.floodOrWeather.label": "Flood / weather hazard",
  "report.kind.floodOrWeather.short": "Weather",
  "report.kind.floodOrWeather.helper":
    "Flood, strong wind, landslide, earthquake impact, or weather danger.",
  "report.kind.fireOrSmoke.label": "Fire / smoke",
  "report.kind.fireOrSmoke.short": "Fire",
  "report.kind.fireOrSmoke.helper":
    "Visible fire, heavy smoke, electrical fire, vehicle fire, or land fire.",
  "report.kind.publicSafety.label": "Public safety issue",
  "report.kind.publicSafety.short": "Safety",
  "report.kind.publicSafety.helper":
    "Fight, theft, risky crowd, disturbance, or safety concern.",
  "report.kind.medicalOrRescue.label": "Medical / rescue needed",
  "report.kind.medicalOrRescue.short": "Rescue",
  "report.kind.medicalOrRescue.helper":
    "Injury, fainting, drowning, evacuation, or urgent help needed.",
  "report.kind.missingPerson.label": "Missing person",
  "report.kind.missingPerson.short": "Missing",
  "report.kind.missingPerson.helper":
    "Someone is missing and community visibility may help.",
  "report.kind.lostItemOrVehicle.label": "Lost item / vehicle",
  "report.kind.lostItemOrVehicle.short": "Lost",
  "report.kind.lostItemOrVehicle.helper":
    "Lost bag, wallet, important item, bicycle, motorcycle, or vehicle.",
  "report.kind.otherIncident.label": "Not sure / other",
  "report.kind.otherIncident.short": "Other",
  "report.kind.otherIncident.helper":
    "Use this when the report does not match the options above.",

  "report.impact.peopleInDanger.label": "People may be in danger",
  "report.impact.peopleInDanger.helper":
    "Someone could be hurt or needs people nearby to stay alert.",
  "report.impact.accessBlocked.label": "Road or access is blocked",
  "report.impact.accessBlocked.helper":
    "Vehicles, pedestrians, or responders may have trouble passing.",
  "report.impact.needsEmergencyHelp.label": "Emergency help may be needed",
  "report.impact.needsEmergencyHelp.helper":
    "Responder, medical, rescue, security, or official help may be needed.",
  "report.impact.stillHappening.label": "It is still happening now",
  "report.impact.stillHappening.helper":
    "Turn this off if the situation already looks over or cleared.",
  "report.impact.locationIsExact.label": "I am at or very close to the incident",
  "report.impact.locationIsExact.helper":
    "Turn this on only if the selected pin really matches the incident location.",

  "incident.severity.low.label": "Low",
  "incident.severity.low.description":
    "Not immediately dangerous, but still useful for nearby people to know.",
  "incident.severity.medium.label": "Medium",
  "incident.severity.medium.description":
    "Disrupts nearby activity and needs caution.",
  "incident.severity.high.label": "High",
  "incident.severity.high.description":
    "Dangerous, urgent, and needs quick attention.",
} as const;
