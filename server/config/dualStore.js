const mockData = {
  users: [
    {
      _id: "u_admin",
      name: "Alex Morgan",
      email: "admin@backtoyou.com",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      createdAt: new Date().toISOString()
    },
    {
      _id: "u_user1",
      name: "Sarah Chen",
      email: "sarah.chen@university.edu",
      role: "user",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      createdAt: new Date().toISOString()
    },
    {
      _id: "u_user2",
      name: "David Miller",
      email: "david.m@techcorp.io",
      role: "user",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      createdAt: new Date().toISOString()
    }
  ],
  items: [
    {
      _id: "item_101",
      title: "MacBook Pro M2 14-inch",
      description: "Lost near Campus Library, 2nd floor quiet study zone. Has sticker 'MERN Stack Developer' on top lid.",
      category: "Electronics",
      type: "lost",
      status: "lost",
      location: { address: "Central Library, Floor 2", lat: 37.7749, lng: -122.4194 },
      images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"],
      tags: ["macbook", "laptop", "apple", "electronics"],
      reporter: { _id: "u_user1", name: "Sarah Chen", email: "sarah.chen@university.edu" },
      dateReported: new Date(Date.now() - 86400000 * 2).toISOString(),
      proofQuestions: ["What color is the keyboard sleeve?"]
    },
    {
      _id: "item_102",
      title: "Found MacBook Pro in Library Lounge",
      description: "Found an Apple laptop with tech stickers left on desk near Coffee Kiosk.",
      category: "Electronics",
      type: "found",
      status: "found",
      location: { address: "Campus Library Lounge", lat: 37.7752, lng: -122.4188 },
      images: ["https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80"],
      tags: ["macbook", "apple", "laptop", "electronics"],
      reporter: { _id: "u_user2", name: "David Miller", email: "david.m@techcorp.io" },
      dateReported: new Date(Date.now() - 18000000).toISOString(),
      proofQuestions: ["Can you unlock with your fingerprint or serial number?"]
    },
    {
      _id: "item_103",
      title: "Leather Wallet with Transit Pass",
      description: "Brown genuine leather wallet lost in Science Building Auditorium B.",
      category: "ID & Wallet",
      type: "lost",
      status: "lost",
      location: { address: "Science Building Auditorium B", lat: 37.7780, lng: -122.4150 },
      images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80"],
      tags: ["wallet", "leather", "brown", "id card"],
      reporter: { _id: "u_user1", name: "Sarah Chen", email: "sarah.chen@university.edu" },
      dateReported: new Date(Date.now() - 86400000 * 3).toISOString(),
      proofQuestions: ["What initials are stamped inside?"]
    }
  ],
  claims: [
    {
      _id: "claim_201",
      itemId: "item_102",
      claimantId: "u_user1",
      claimantName: "Sarah Chen",
      claimantEmail: "sarah.chen@university.edu",
      proofText: "This is my laptop! Serial ends in 98A.",
      proofImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
      status: "pending",
      createdAt: new Date(Date.now() - 10800000).toISOString()
    }
  ],
  messages: [],
  notifications: []
};

class DBStore {
  constructor() {
    this.data = mockData;
  }
  getUsers() { return this.data.users; }
  getItems() { return this.data.items; }
  getClaims() { return this.data.claims; }
  getMessages() { return this.data.messages; }
  getNotifications(userId) {
    if (!userId) return this.data.notifications;
    return this.data.notifications.filter(n => n.userId === userId);
  }
  addItem(item) {
    const newItem = {
      _id: "item_" + Date.now(),
      dateReported: new Date().toISOString(),
      status: item.type === "lost" ? "lost" : "found",
      proofQuestions: item.proofQuestions || ["Verify serial or mark"],
      tags: item.tags || item.title.toLowerCase().split(' '),
      ...item
    };
    this.data.items.unshift(newItem);
    return newItem;
  }
  updateItem(id, updates) {
    const idx = this.data.items.findIndex(i => i._id === id);
    if (idx !== -1) {
      this.data.items[idx] = { ...this.data.items[idx], ...updates };
      return this.data.items[idx];
    }
    return null;
  }
  deleteItem(id) {
    this.data.items = this.data.items.filter(i => i._id !== id);
    return true;
  }
  addClaim(claim) {
    const newClaim = {
      _id: "claim_" + Date.now(),
      status: "pending",
      createdAt: new Date().toISOString(),
      ...claim
    };
    this.data.claims.unshift(newClaim);
    return newClaim;
  }
  updateClaimStatus(claimId, status) {
    const claim = this.data.claims.find(c => c._id === claimId);
    if (claim) {
      claim.status = status;
      if (status === "approved") {
        this.updateItem(claim.itemId, { status: "claimed" });
      }
      return claim;
    }
    return null;
  }
  addMessage(msg) {
    const newMsg = { _id: "msg_" + Date.now(), timestamp: new Date().toISOString(), ...msg };
    this.data.messages.push(newMsg);
    return newMsg;
  }
  addNotification(notif) {
    const newNotif = { _id: "notif_" + Date.now(), read: false, createdAt: new Date().toISOString(), ...notif };
    this.data.notifications.unshift(newNotif);
    return newNotif;
  }
}

module.exports = { db: new DBStore() };
